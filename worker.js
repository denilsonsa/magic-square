'use strict';

function is_magic(board) {
	const size = board.length;

	var basesum = 0;
	for (let i = 0; i < size; i++) {
		basesum += board[0][i];
	}

	var sum;

	for (let i = 0; i < size; i++) {
		sum = 0;
		for (let j = 0; j < size; j++) {
			sum += board[i][j];
		}
		if (sum != basesum) {
			return false;
		}
	}

	for (let i = 0; i < size; i++) {
		sum = 0;
		for (let j = 0; j < size; j++) {
			sum += board[j][i];
		}
		if (sum != basesum) {
			return false;
		}
	}

	sum = 0;
	for (let i = 0; i < size; i++) {
		sum += board[i][i];
	}
	if (sum != basesum) {
		return false;
	}

	sum = 0;
	for (let i = 0; i < size; i++) {
		sum += board[size - 1 - i][i];
	}
	if (sum != basesum) {
		return false;
	}

	sum = 0;
	for (let i = 0; i < size; i++) {
		sum += board[i][size - 1 - i];
	}
	if (sum != basesum) {
		return false;
	}

	sum = 0;
	for (let i = 0; i < size; i++) {
		sum += board[size - 1 - i][size - 1 - i];
	}
	if (sum != basesum) {
		return false;
	}

	return true;
}

function recursive_brute_force(board, available, index) {
	const size = board.length;
	for (let i = 0; i < available.length; i++) {
		if (available[i]) {
			board[~~(index / size)][index % size] = i + 1;
			available[i] = 0;
			if (index + 1 == available.length) {
				if (is_magic(board)) {
					postMessage(board);
				}
			} else {
				recursive_brute_force(board, available, index + 1);
			}
			available[i] = 1;
		}
	}
}

function recalculate(size) {
	// Init.
	var board = [];
	for (let i = 0; i < size; i++) {
		board[i] = [];
		for (let j = 0; j < size; j++) {
			board[i][j] = null;
		}
	}

	var available = [];
	for (let i = 0; i < size * size; i++) {
		available[i] = 1;
	}

	debugger;
	recursive_brute_force(board, available, 0);
}

onmessage = function(ev) {
	var size = ev.data;
	recalculate(size);
	postMessage(null);
};
