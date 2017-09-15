'use strict';

// If board is complete (i.e. all elements are numbers)
// then returns true or false, depending if it is a magic square.
// If the board is not complete (i.e. some elements are null)
// then returns true if the board can become a magic square,
// or false if it definitely cannot be a magic square.
function is_magic(board) {
	const size = board.length;
	const magicsum = size * (size * size + 1) / 2;
	var is_incomplete = false;
	var sum;

	// Horizontals.
	horizontals:
	for (let i = 0; i < size; i++) {
		sum = 0;
		for (let j = 0; j < size; j++) {
			if (board[i][j] === null) {
				is_incomplete = true;
				break horizontals;
			} else {
				sum += board[i][j];
			}
		}
		if (sum !== magicsum) {
			return false;
		}
	}

	// Verticals.
	verticals:
	for (let i = 0; i < size; i++) {
		sum = 0;
		for (let j = 0; j < size; j++) {
			if (board[j][i] === null) {
				is_incomplete = true;
				break verticals;
			} else {
				sum += board[j][i];
			}
		}
		if (sum !== magicsum) {
			return false;
		}
	}

	// Diagonal.
	if (board[size - 1][0] !== null) {
		sum = 0;
		for (let i = 0; i < size; i++) {
			sum += board[size - 1 - i][i];
		}
		if (sum !== magicsum) {
			return false;
		}
	}

	if (is_incomplete) {
		// Incomplete board.
		return true;  // More like "maybe".
	}

	// Diagonal.
	sum = 0;
	for (let i = 0; i < size; i++) {
		sum += board[i][i];
	}
	if (sum !== magicsum) {
		return false;
	}

	// This is definitely a magic square!
	return true;
}

function recursive_brute_force(board, available, index) {
	const size = board.length;
	for (let i of numbers_in_random_order(size * size)) {
		if (available[i]) {
			board[~~(index / size)][index % size] = i + 1;
			available[i] = false;
			if (index + 1 === size * size) {
				// Board completed. Is it magic?
				if (is_magic(board)) {
					postMessage(board);
				}
			} else {
				// Board incomplete, we need to recurse.
				// But first let's check if the incomplete board can become a
				// magic square or if we can already abort this brute-force branch.
				if (index + 1 < size || is_magic(board)) {
					recursive_brute_force(board, available, index + 1);
				}
			}
			available[i] = true;
			board[~~(index / size)][index % size] = null;
		}
	}
}

// Main function of this script. Well, the entry point.
function recalculate(size) {
	var board = [];
	for (let i = 0; i < size; i++) {
		board[i] = [];
		for (let j = 0; j < size; j++) {
			board[i][j] = null;
		}
	}

	// Numbers still available to be used.
	var available = [];
	for (let i = 0; i < size * size; i++) {
		available[i] = true;
	}

	recursive_brute_force(board, available, 0);
}

function shuffle_array_in_place(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[j], arr[i]] = [arr[i], arr[j]];
	}
}

// Returns an array of numbers from 0 until max-1 in a random order.
function numbers_in_random_order(max) {
	var arr = [];
	for (let i = 0; i < max; i++) {
		arr[i] = i;
	}
	shuffle_array_in_place(arr);
	return arr;
}

onmessage = function(ev) {
	var size = ev.data;
	recalculate(size);
	postMessage(null);
};
