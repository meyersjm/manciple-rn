import {
	Alert,
	DrawerLayoutAndroid,
	FlatList,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { useState, useRef } from 'react';
import {
	Button,
	Card,
	Icon,
	Input
} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Dialog from 'react-native-dialog';
import { _Styles } from '../res/_Styles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PantryItem from '../components/PantryItem';
import * as Pantry from '../slices/pantriesSlice';
import * as Global from '../slices/globalSlice';
import * as Utils from '../utils/utils';

export default function MainScreen() {
	const dispatch = useDispatch();
	const { _Pantries, currentPantry } = useSelector(S => S.pantries);
	const { debug } = useSelector(S => S.options);
	const { mode } = useSelector(S => S.global);
	const [ view, setView ] = useState('list');
	const [ currentItem, setCurrentItem ] = useState({});
	const [ updatedName, setUpdatedName ] = useState('');
	const [ updatedQty, setUpdatedQty ] = useState('');
	const [ updatedPrice, setUpdatedPrice ] = useState('');
	const [ updatedLoc, setUpdatedLoc ] = useState('');
	const [ updatedURL, setUpdatedURL ] = useState('');
	const [ updatedUPC, setUpdatedUPC ] = useState('');
	const [ updatedInterval, setUpdatedInterval ] = useState('');
	const [ updatedNotes, setUpdatedNotes ] = useState('');
	const [ pantryToEdit, setPantryToEdit ] = useState(_Pantries[currentPantry]);

	// Modal and Dialog toggles
	const [ showModal, setShowModal ] = useState(false);
	const [ showNewPantryDialog, setShowNewPantryDialog ] = useState(false);
	const [ showEditPantryDialog, setShowEditPantryDialog ] = useState(false);
	//const [ updatedPurchaseBy, setUpdatedPurchaseBy ] = useState({});

	// Input field variables
	const [ inputNewPantry, setInputNewPantry ] = useState('');
	const [ inputEditPantry, setInputEditPantry ] = useState('');

	const drawer = useRef(null);
	//dispatch(Global.setLastUse(Date.now()));

	const LoginHandler = _ => {
		return (
			<Text>
				Login Handler
			</Text>
		);
	};

	const setDrawerOpen = _ => {
		console.log('Drawer:', drawer);

		drawer.current.openDrawer();
	};

	const setDrawerClosed = _ => {
		drawer.current.closeDrawer();
	};

	const handlePantryChange = ptID => {
		console.log('handleListChange', ptID);

		dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.id === ptID))));
		setDrawerClosed();
	};

	const editPantry = ptID => {
		console.log('editPantry', ptID);
		setPantryToEdit(_Pantries.find(pt => pt.id === ptID));
		//setInputEditPantry(_Pantries.find(pt => pt.id === ptID).name);
		setInputEditPantry(pantryToEdit.str);
		drawer.current.closeDrawer();
		setShowEditPantryDialog(!showEditPantryDialog);
	};
/*
	const handleNewPantry = inputText => {
		console.log('handleNewList', inputText);

		if(inputText) {
			dispatch(Pantry.addPantry(inputText));
		}
	}
*/

	const handleNPDCancel = _ => {
		setShowNewPantryDialog(!showNewPantryDialog);
		setInputNewPantry('');
	}

	const handleNPDCreate = _ => {
		console.log('handleNPDCreate', inputNewPantry);

		dispatch(Pantry.addPantry(inputNewPantry));
		_Pantries.map((pt, idx) => console.log(`_Pantries[${idx}] = ${pt.name}`));
		//dispatch(Pantry.setPantry(_Pantries.indexOf(_Pantries.find(pt => pt.name === inputNewPantry))));
		setShowNewPantryDialog(!showNewPantryDialog);
		setInputNewPantry('');
	}

	const handleEPDCancel = _ => {
		setShowEditPantryDialog(!showEditPantryDialog);
		setInputEditPantry('');
	};

	const handleEPDCommit = _ => {
		const updatedPantry = {
			..._Pantries.find(pt => pt.id === pantryToEdit.id),
			name: inputEditPantry
		};

		setShowEditPantryDialog(!showEditPantryDialog);
		dispatch(Pantry.updatePantry(updatedPantry));
		setPantryToEdit(_Pantries[currentPantry]);
	};

	const handleEPDDelete = _ => {
		console.log('handleEPDDelete:', pantryToEdit.id);
		setShowEditPantryDialog(!showEditPantryDialog);

		Alert.alert(
			'Delete pantry?'
			`Are you sure you wish to delete the pantry ${pantryToDelete.name}?
			  All of your item and purchase history will be lost!`,
			[
				{
					text: 'Cancel',
					onPress: _ => handlePantryDeleteCancel(),
					style: 'cancel'
				},
				{
					text: 'OK',
					onPress: _ => handlePantryDeleteConfirm(),
				}
			],
			{
				cancelable: true,
				onDismiss: _ => handlePantryDeleteCancel()
			}
		);
	}

	const handlePantryDeleteConfirm = _ => {
		const idx = _Pantries.indexOf(pantryToEdit);

		if(idx === currentPantry) {
			if(idx === 0) dispatch(Pantry.setPantry(1));
			else dispatch(Pantry.setPantry(idx - 1));
		}

		pantryToEdit=(_Pantries[currentPantry]);
		dispatch(Pantry.deletePantry(idx));
	}


	const renderDrawer = _ => {
		return (
			<>
				<LoginHandler />
				<FlatList
					data={_Pantries}
					keyExtractor={item => item.id}
					renderItem={({ item: pantry }) => (
						<Pressable
							onPress={_ => handlePantryChange(pantry.id)}
							onLongPress={_ => editPantry(pantry.id)}
							style={{
								borderBottomWidth: 1,
								borderBottomColor: 'lightgray',
								paddingVertical: 10,
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<Icon
									name='list'
									type='entypo'
									size={22}
									style={{
										marginRight: 3,
										marginLeft: 10
									}}
								/>
								<Text
									style={{
										fontSize: 18
									}}
								>
									{pantry.name}
								</Text>
							</View>
						</Pressable>
					)}
				/>
				<Pressable
					onPress={_ => {
						console.log('New pantry pressed');
						drawer.current.closeDrawer();
						setShowNewPantryDialog(!showNewPantryDialog);
					}}
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='add-to-list'
							type='entypo'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							New Pantry...
						</Text>
					</View>
				</Pressable>
				<Pressable
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='settings'
							type='material'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							Settings
						</Text>
					</View>
				</Pressable>
				<Pressable
					style={{
						borderBottomWidth: 1,
						borderBottomColor: 'lightgray',
						paddingVertical: 10,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<Icon
							name='help-circle-outline'
							type='material-community'
							size={22}
							style={{
								marginRight: 3,
								marginLeft: 10
							}}
						/>
						<Text
							style={{
								fontSize: 18
							}}
						>
							Help
						</Text>
					</View>
				</Pressable>
			</>
		);
	}

	const handleCheckBox = itemID => {
		console.log("handleCheckBox called with item", itemID);

		mode === 'list' && dispatch(Pantry.toggleNeeded(itemID)) || dispatch(Pantry.toggleListed(itemID));
	};

	const handleSweep = rowKey => {
		console.log('**************');
		console.log('handleSweep called with rowKey', rowKey);
		console.log('**************');

		dispatch(Pantry.toggleListed(rowKey));
	};

	const handleToggleStaple = itemID => {
		console.log('handleToggleStaple called with item', itemID);

		dispatch(Pantry.toggleStaple(itemID));
	};

	const handleDateChange = (item, date) => {
		console.log('handleDateChange called with\n\titem:', item, '\n\tdate:', date);
		dispatch(Pantry.updateItem({
			itemID: item.id,
			updatedItem: {
				...item,
				purchaseBy: date.getTime()
			}
		}));
	}

	const editItem = item => {
		setCurrentItem(item);
		setUpdatedName(item.name);
		setUpdatedQty(item.qty);
		setUpdatedPrice(item.price);
		setUpdatedLoc(item.loc);
		setUpdatedURL(item.url);
		setUpdatedUPC(item.upc);
		setUpdatedInterval(item.interval.toString());
		setUpdatedNotes(item.notes);

		setShowModal(!showModal);
	}

	const handleEditItemCommit = _ => {
		setShowModal(!showModal);
		setCurrentItem({});

		const updatedItem = {
			...currentItem,
			name: updatedName,
			id: Utils.camelize(updatedName),
			qty: updatedQty,
			price: updatedPrice,
			loc: updatedLoc,
			url: updatedURL,
			upc: updatedUPC,
			interval: parseInt(updatedInterval),
			notes: updatedNotes
		};

		dispatch(Pantry.updateItem({
			itemID: currentItem.id,
			updatedItem
		}));
	}

	const resetState = _ => {
		setShowModal(false);
		setCurrentItem({});
		setUpdatedName('');
		setUpdatedQty('');
		setUpdatedPrice('');
		setUpdatedLoc('');
		setUpdatedURL('');
		setUpdatedUPC('');
		setUpdatedInterval('');
		setUpdatedNotes('');
		//setUpdatedPurchaseBy({});

		console.log('State reset');
	}

	return (
		<DrawerLayoutAndroid
			ref={drawer}
			drawerWidth={300}
			drawerPosition='left'
			renderNavigationView={renderDrawer}
		>
			<Header
				drawerCtl={setDrawerOpen}
			/>
			<SwipeListView
				data={
					mode === 'list'
					? _Pantries[currentPantry].inventory.filter(i => i.listed).map(item => ({
						item,
						key: item.id,
						dispatch
					}))
					: _Pantries[currentPantry].inventory.map(item => ({
						item,
						key: item.id,
						dispatch
					}))
				}
				renderItem={(data, rowMap) => {
					console.log('************');
					console.log('renderItem: ');
					console.log('\tdata:', Utils.truncateString(''+data, 60));
					console.log('\trowMap:', Utils.truncateString(''+rowMap, 60));
					console.log('************');
					const { item: { item } } = data;
					return (
						<PantryItem
							item={item}
							exports={{
								handleCheckBox,
								handleDateChange
							}}
						/>
					)
				}}
				renderHiddenItem={(data, rowMap) => {
					const { item: { item }} = data;
					return (
					<View style={{
						alignItems: 'flex-end',
						justifyContent: 'center',
						borderWidth: 1,
						borderColor: 'purple',
					}}>
						<Button
							onPress={_ => {
									editItem(item);
									//rowMap[item.id].close();
								}
							}
							icon={
								<Icon
									name='pencil'
									type='font-awesome'
									color='white'
									style={{ marginRight: 5 }}
								/>
							}
							title='Edit'
							style={{ width: 100 }}
						/>
						<Button
							onPress={_ => handleToggleStaple(item.id)}
							icon={
								<Icon
									name={item.staple ? 'toggle-on' : 'toggle-off'}
									type='font-awesome'
									color='black'
									style={{ marginRight: 5 }}
								/>
							}
							title='Staple'
							type='outline'
						/>
					</View>
				)
				}}
				rightOpenValue={-100}
				leftActivationValue={75}
				leftActionValue={500}
				onLeftAction={handleSweep}
				bottomDivider
				closeOnRowPress
				closeOnRowBeginSwipe
				closeOnRowOpen
				closeOnScroll
			/>
			<Modal
				transparent={false}
				visible={showModal}
				onRequestClose={_ => setShowModal(!showModal)}
			>
				<Text>
					Name
				</Text>
				<Input
					placeholder='Item name'
					value={updatedName}
					onChangeText={t => setUpdatedName(t)}
				/>
				<Text>
					Quantity
				</Text>
				<Input
					placeholder='Quantity'
					value={updatedQty}
					onChangeText={t => setUpdatedQty(t)}
				/>
				<Text>
					Price
				</Text>
				<Input
					placeholder='Price'
					value={updatedPrice}
					onChangeText={t => setUpdatedPrice(t)}
				/>
				<Text>
					Location
				</Text>
				<Input
					placeholder='Location'
					value={updatedLoc}
					onChangeText={t => setUpdatedLoc(t)}
				/>
				<Text>
					URL
				</Text>
				<Input
					placeholder='URL'
					value={updatedURL}
					onChangeText={t => setUpdatedURL(t)}
				/>
				<Text>
					UPC
				</Text>
				<Input
					placeholder='UPC'
					value={updatedUPC}
					onChangeText={t => setUpdatedUPC(t)}
				/>
				<Text>
					Interval
				</Text>
				<Input
					placeholder='Purchase interval'
					value={updatedInterval}
					keyboardType='number-pad'
					onChangeText={t => setUpdatedInterval(t)}
				/>
				<Text>
					Notes
				</Text>
				<Input
					placeholder='Notes'
					value={updatedNotes}
					onChangeText={t => setUpdatedNotes(t)}
				/>
				<Button
					title='Commit'
					onPress={_ => handleEditItemCommit()}
				/>
				<Button
					title='Cancel'
					onPress={_ => resetState()}
				/>
			</Modal>
			<Dialog.Container visible={showNewPantryDialog}>
				<Dialog.Title>
					Create New Pantry
				</Dialog.Title>
				<Dialog.Input
					placeholder='New pantry name...'
					value={inputNewPantry}
					onChangeText={text => setInputNewPantry(text)}
				/>
				<Dialog.Button label='Cancel' onPress={handleNPDCancel} />
				<Dialog.Button label='Create' onPress={handleNPDCreate} disabled={!inputNewPantry} />
			</Dialog.Container>
			<Dialog.Container visible={showEditPantryDialog}>
				<Dialog.Title>
					Edit Pantry
				</Dialog.Title>
				<Dialog.Input
					placeholder='Edit pantry name...'
					value={inputEditPantry}
					onChangeText={text => setInputEditPantry(text)}
				/>
				<Dialog.Button label='Delete List' onPress={handleEPDDelete} />
				<Dialog.Button label='Cancel' onPress={handleEPDCancel} />
				<Dialog.Button label='OK' onPress={handleEPDCommit} />
			</Dialog.Container>
			<Footer />
		</DrawerLayoutAndroid>
	);
}

