import { useState } from 'react';
import {
	Pressable,
	SafeAreaView,
	Text,
	TextInput,
	View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import uuid from 'react-native-uuid';
import * as Lists from '../slices/listsSlice';
import * as Ist from '../slices/itemStoreSlice';
import * as Utils from '../utils/utils';
import { _Styles } from '../res/_Styles';
import { _Store } from '../res/_Store';

export default function Footer(props) {
	const [ inputText, setInputText ] = useState('');
	const { _Lists, currentList } = useSelector(S => S.lists);
	const { _ItemStore } = useSelector(S => S.itemStore);
	const { handleSweepAll, dumpListData } = props;
	const dispatch = useDispatch();

	const handleSubmit = _ => {
		console.log('handleSubmit', currentList, inputText);

		if(inputText) { // if there's text, parse it and add an item to the pantry
			let [ name = 'New item', qty, ...preTags ] = inputText.split(',');
			if(qty) qty = qty.trim();
			const tags = preTags.length ? preTags.map(t => Utils.camelize(Utils.sanitize(t.trim()))) : [ ];

			let itemID = Object.keys(_ItemStore).find(key =>
				Utils.camelize(Utils.sanitize(_ItemStore[key].name)) ===
				Utils.camelize(Utils.sanitize(name)));
			if(!itemID) {
				// if item doesn't exist, push it to _ItemStore
				const newItem = Utils.createListItem({
					name,
					tags,
					parents: [ currentList ],
					defaultQty: qty || ''
				});
				dispatch(Ist.addItem([ uuid.v4(), newItem ]));
			}
			else {
				invItem = { ..._ItemStore[itemID] };
				if(!invItem.parents.includes(currentList))
					dispatch(Ist.updateItem([ itemID, {
						parents: [
							...invItem.parents,
							currentList
						]
					}));
				dispatch(Lists.addItemToList([ itemID,
					{
						inCart: false,
						qty: qty || invItem.defaultQty || '1',
						purchaseBy: invItem.interval && invItem.history[0]
							? invItem.history[0] + (invItem.interval * 86400000)
							: 0,
					}
				]));

		} else { // if no text, add all staples
			console.log('handleSubmit all:', _Lists[currentList].staples);
			_Lists[currentList].staples.forEach(itemID => {
				console.log('processing staple', itemID);
				// If the item is already listed, continue
				if(Object.keys(_Lists[currentList].inventory).includes(itemID)) return;
				const invItem = _ItemStore[itemID];

				if(Utils.nullp(invItem)) { // if the ID isn't in inventory, toss it
					console.log('found bad id', id);
					dispatch(Lists.updateList([ currentList,
						{
							staples: _Lists[currentList].staples.filter(i => i.id === id)
						}
					]));
				} else { // otherwise add it to the list
					console.log('adding item', itemID);
					dispatch(Lists.addItemToList([ itemID,
						{
							inCart: false,
							qty: invItem.defaultQty || '1',
							purchaseBy: invItem.interval && invItem.history[0]
								? invItem.history[0] + (invItem.interval * 86400000)
								: 0,
						}
					]));
				}
			});
			console.log('handleSubmit all done');
		}
		console.log('handleSubmit done');
		setInputText('');

	}

	const dumpState = _ => {
		const state = _Store.getState();

		console.log(state);
	}

	return (
		<SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
			<TextInput
				style={_Styles.footerTextBox}
				onChangeText={setInputText}
				value={inputText}
				placeholder='Add an item ...'
			/>
			<Icon
				style={_Styles.footerIcon}
				name='plus'
				type='font-awesome'
				color='royalblue'
				reverse
				onPress={handleSubmit}
				disabled={currentList === -1}
			/>
			<Icon
				style={_Styles.footerIcon}
				name='broom'
				type='font-awesome-5'
				color='royalblue'
				reverse
				onPress={handleSweepAll}
			/>
			<Pressable
				onPress={dumpListData}
				onLongPress={dumpState}
			>
					<Icon
						style={_Styles.footerIcon}
						name='dump-truck'
						type='material-community'
						color='royalblue'
						reverse
					/>
			</Pressable>
		</SafeAreaView>
	);
}
