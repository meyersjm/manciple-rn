// inventorySlice.js
// Handles actions for adding, updating, or deleting items

import { createSlice } from '@reduxjs/toolkit';
import { INVENTORY } from '../res/DEFAULT';
import * as Utils from '../utils/utils';

const initialState = {
	_Inventory: INVENTORY,
	deleted: [ ]
}

const inventorySlice = createSlice({
	name: 'inventory',
	initialState,
	reducers: {
		addItem: (iState, action) => {
			// For adding a new item to inventory, but can handle item updates as well
			// Expects a PantryItem object as payload
			if(!action.payload) return iState;
			if(action.payload.type !== 'item') return iState;

			let idx = iState._Inventory.indexOf(iState.inventory.find(item => item.id === action.payload.id));
			if(idx !== -1) {
				// if item with matching id is already in state, update it
				iState._Inventory.splice({ ...iState._Inventory[idx], ...action.payload }, idx, 1);
			} else {
				// otherwise push item to inventory
				iState._Inventory.push(action.payload);
			}
		},
		updateItem: (iState, action) => {
			// For updating an existing item
			// expects an array [ id, { updated props } ]
			if(!action.payload) return iState;
			const [ id, props ] = action.payload;
			if(!id || !props) return iState;

			props = { ...props, modifyDate: Date.now() };

			let idx = iState._Inventory.indexOf(iState.inventory.find(item => item.id === id));
			if(idx === -1) return iState;

			const newItem = { ...iState._Inventory[idx], ...action.payload };

			iState._Inventory.splice(newItem, idx, 1);
		},
		deleteItem: (iState, action) => {
			// For deleting an item from inventory
			// expects an item ID
			if(!action.payload) return iState;

			return {
				_Inventory: iState._Inventory.filter(item => item.id !== action.payload),
				deleted: [ ...iState.deleted.push(action.payload) ]
			};
		},
		clearDeleted: (iState, action) => {
			// once the remote delete operation has run, clear the state
			return { ...iState, deleted: [ ] };
		}
	}
});

export const inventoryReducer = inventorySlice.reducer;

export const {
	addItem,
	updateItem,
	deleteItem
} = inventorySlice.actions;

