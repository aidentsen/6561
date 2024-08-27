import copy
import random
import time


class Board:
    """Initialise the board"""
    def __init__(self, base, size, post_merge=False):
        if base <= 1:
            raise ValueError("The base must be greater than 1")
        self.base = base

        if size <= base:
            raise ValueError("The grid dimensions must be greater than the base")
        self.size = size

        if post_merge:  # variable that indicates whether adjacent identical tiles are merged together at the end
            if base > 5:
                raise ValueError("This feature only works for bases up to 5")
        self.post_merge = post_merge

        self.board = [[0] * size for _ in range(size)]  # create empty board
        self.score = 0  # initial score is zero

        for _ in range(self.base):
            self.add_new_tile()

    """Add a new tile to the board"""
    def add_new_tile(self):
        empty_tiles = [(row, col) for row in range(self.size) for col in range(self.size) if self.board[row][col] == 0]
        if empty_tiles:
            row, col = random.choice(empty_tiles)  # selects the coordinates of a random empty tile
            self.board[row][col] = self.base if random.random() < 0.9 else self.base ** 2

    """Compress the board, removing any empty tiles"""
    def compress(self, row):
        compressed_row = [num for num in row if num != 0]
        compressed_row += [0] * (self.size - len(compressed_row))  # created for the left
        return compressed_row

    """Merge the rows together"""
    def merge(self, row):
        for i in range(self.size - (self.base - 1)):  # n instances of num need to be merged to create n * num
            if row[i] != 0:
                loop_broken = False  # needed to keep track of whether any of the numbers don't match
                for j in range(1, self.base):
                    if row[i + j] != row[i]:
                        loop_broken = True
                        break
                if not loop_broken:
                    row[i] *= self.base
                    self.score += row[i]
                    for j in range(1, self.base):  # clear the non-centre merged tiles
                        row[i + j] = 0
        return row

    """Logic for moving the board to the left, upon which all of right, up and down are based"""
    def move_left(self):
        new_grid = []
        valid_move = True  # valid moves require the board to change state by the end
        for row in self.board:
            compressed_row = self.compress(row)  # remove all empty tiles
            # when moving to visualised version, this is where a visual update would be
            merged_row = self.merge(compressed_row)  # merge together tiles
            # visual update 2
            new_row = self.compress(merged_row)  # remove any introduced empty tiles
            # visual update 3
            new_grid.append(new_row)
        if self.board == new_grid:
            valid_move = False
        self.board = new_grid
        return valid_move

    def move_right(self):
        self.board = [list(reversed(row)) for row in self.board]  # reverse the board so it can be moved left
        valid_move = self.move_left()
        self.board = [list(reversed(row)) for row in self.board]  # reverse back
        return valid_move

    def move_up(self):
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]  # transpose
        valid_move = self.move_left()
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]  # transpose back
        return valid_move

    def move_down(self):
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]  # transpose
        valid_move = self.move_right()
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]  # transpose back
        return valid_move

    """Feature for base 3 onward, to merge together n adjacent tiles with the same value at the end"""
    def merge_cells(self):
        directions = [
            (-1, 0),  # above
            (0, -1),  # left
            (1, 0),  # below
            (0, 1)  # right
        ]

        old_board = copy.deepcopy(self.board)  # keeps track of whether there have been any changes

        for row in range(self.size):
            for col in range(self.size):
                if self.board[row][col] != 0:  # don't run for empty squares
                    same_value_locations = []
                    for y, x in directions:
                        new_row, new_col = row + y, col + x
                        if 0 <= new_row < self.size and 0 <= new_col < self.size:  # accounts for edges of the board
                            if self.board[row][col] == self.board[new_row][new_col]:
                                same_value_locations.append((new_row, new_col))
                                if len(same_value_locations) == self.base - 1:
                                    self.board[row][col] *= self.base
                                    self.score += self.board[row][col]
                                    for y_coord, x_coord in same_value_locations:  # clear the non-centre merged tiles
                                        self.board[y_coord][x_coord] = 0
                                    break

        if old_board != self.board:  # shows the board update if the board has changed through merges
            print("Merging...\n")
            time.sleep(1)
            self.display()
        return old_board != self.board

    """Evaluates whether there are any empty tiles, or there are any valid moves on the board"""
    def can_move(self):
        for row in range(self.size):
            for col in range(self.size):

                if self.board[row][col] == 0:  # empty tile present
                    return True

                if row < self.size - (self.base - 1):  # checks rows for valid moves if board is full
                    loop_broken = False
                    for i in range(1, self.base):
                        if self.board[row + i][col] != self.board[row][col]:
                            loop_broken = True
                            break
                    if not loop_broken:
                        return True

                if col < self.size - (self.base - 1):  # checks columns for valid moves if board is full
                    loop_broken = False
                    for j in range(1, self.base):
                        if self.board[row][col + j] != self.board[row][col]:
                            loop_broken = True
                            break
                    if not loop_broken:
                        return True

        return False  # no valid moves, i.e. game is over

    """Displays the board in the terminal"""
    def display(self):
        print(f'Score: {self.score}')
        for row in self.board:
            print(' '.join([f'{str(col):<5}' for col in row]))
        print()

    """Game loop: terminal version"""
    def play(self):
        bindings = {
            'w': self.move_up,
            's': self.move_down,
            'a': self.move_left,
            'd': self.move_right
        }

        while True:
            self.display()

            if self.post_merge:  # run the additional merging function if the toggle is on
                while self.merge_cells():  # merge cells until there are no more changes to the board
                    pass

            move = input("Enter a direction (w/a/s/d): ")
            if move in bindings.keys():
                valid_move = bindings[move]()
                if valid_move:

                    if self.post_merge:  # run the additional merging function if the toggle is on
                        while self.merge_cells():  # merge cells until there are no more changes to the board
                            pass

                    if not self.can_move():  # i.e. game over
                        self.display()
                        print("Game over!")
                        break

                    self.add_new_tile()  # adds a new tile to the board
                else:
                    print("Invalid move - move provided must change ths state of the board")
                    time.sleep(2)
                print("\n---\n")  # divides terminal between moves
            else:
                print("Invalid move - only w/a/s/d allowed")
                time.sleep(2)


game6561 = Board(3, 5, True)

game6561.score = 17217
game6561.board = [
    [2187, 2187, 0, 2187, 0],
    [0, 27, 243, 27, 3],
    [0, 0, 3, 0, 27],
    [0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0]
]
game6561.play()
