// NavDrawerComponent.js
// Called by MainComponent, provides navigation between lists and access to
// new lists, options, help, and user management
// Might be replaced with react-native-navigation

// react, RN, community imports
import { useSelector } from 'react-redux';
import {
	FlatList,
	Pressable,
	Text,
	View
} from 'react-native';
import {
	Icon
} from 'react-native-elements';

// component imports
import UserComponent from '../components/UserComponent';

export default function NavDrawer({ drawer, _Xstate, setXstate }) {
	const {
		showPantryDetail,
		showPantryCreate,
		funs: { handlePantryChange }
	} = _Xstate;
	const { _Lists, currentList } = useSelector(S => S.lists);

	return (
		<>
			<UserComponent drawer={drawer} _Xstate={_Xstate} setXstate={setXstate} />
			{ Object.keys(_Lists).length &&
				<FlatList
					data={Object.keys(_Lists)}
					keyExtractor={key => key}
					renderItem={key => (
						const pantry = _Lists[key];
						<Pressable
							onPress={_ => handlePantryChange(key)}
							onLongPress={_ => {
								setXstate({
									'showPantryDetail': true,
									'pantryToEdit': key
								});
								drawer.closeDrawer();
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
			}
			<Pressable
				onPress={_ => {
					console.log('New pantry pressed');
					drawer.closeDrawer();
					setXstate({
						'currentPage': 'pantry',
						'headerTitle': `${_Lists[currentList].name}: List view`,
						'headerControls': true,
						'showPantryCreate': true
					});
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
				onPress={_ => {
					setXstate({
						'currentPage': 'options',
						'headerTitle': 'Manciple Options',
						'headerControls': false
					});
					drawer.closeDrawer();
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
				onPress={_ => {
					setXstate({
						'currentPage': 'help',
						'headerTitle': 'Manciple Help',
						'headerControls': false
					});
					drawer.closeDrawer();
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
