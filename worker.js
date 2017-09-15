'use strict';

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
	for (let i = 0; i < available.length; i++) {
		if (available[i]) {
			board[~~(index / size)][index % size] = i + 1;
			available[i] = false;
			if (index + 1 === available.length) {
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

onmessage = function(ev) {
	var size = ev.data;
	recalculate(size);
	postMessage(null);
};
