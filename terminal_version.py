import copy
import random
import time


class Board:
    """Initialise the board"""
    def __init__(self, num, size, post_merge=False):
        if num <= 1:
            raise ValueError("The base must be greater than 1")
        self.num = num

        if size <= num:
            raise ValueError("The grid dimensions must be greater than the base")
        self.size = size

        if post_merge:
            if num > 5:
                raise ValueError("This feature only works for bases up to 5")
        self.post_merge = post_merge

        self.board = [[0] * size for _ in range(size)]
        self.score = 0

        self.add_new_tile()
        self.add_new_tile()

    """Add a new tile to the board"""
    def add_new_tile(self):
        empty_tiles = [(row, col) for row in range(self.size) for col in range(self.size) if self.board[row][col] == 0]
        if empty_tiles:
            row, col = random.choice(empty_tiles)
            self.board[row][col] = self.num if random.random() < 0.9 else self.num ** 2

    """Compress the board, removing any empty tiles"""
    def compress(self, row):
        compressed_row = [num for num in row if num != 0]
        compressed_row += [0] * (self.size - len(compressed_row))
        return compressed_row

    """Merge the rows together"""
    def merge(self, row):
        for i in range(self.size - (self.num - 1)):
            if row[i] != 0:
                loop_broken = False
                for j in range(1, self.num):
                    if row[i + j] != row[i]:
                        loop_broken = True
                        break
                if not loop_broken:
                    row[i] *= self.num
                    self.score += row[i]
                    for j in range(1, self.num):
                        row[i + j] = 0
        return row

    def move_left(self):
        new_grid = []
        valid_move = True
        for row in self.board:
            compressed_row = self.compress(row)
            merged_row = self.merge(compressed_row)
            new_row = self.compress(merged_row)
            new_grid.append(new_row)
        if self.board == new_grid:
            valid_move = False
        self.board = new_grid
        return valid_move

    def move_right(self):
        self.board = [list(reversed(row)) for row in self.board]
        valid_move = self.move_left()
        self.board = [list(reversed(row)) for row in self.board]
        return valid_move

    def move_up(self):
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]
        valid_move = self.move_left()
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]
        return valid_move

    def move_down(self):
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]
        valid_move = self.move_right()
        self.board = [[self.board[j][i] for j in range(self.size)] for i in range(self.size)]
        return valid_move

    def merge_cells(self):
        directions = [
            (-1, 0),  # above
            (0, -1),  # left
            (1, 0),  # below
            (0, 1)  # right
        ]

        old_board = copy.deepcopy(self.board)

        for row in range(self.size):
            for col in range(self.size):
                if self.board[row][col] != 0:
                    same_value_locations = []
                    for y, x in directions:
                        new_row, new_col = row + y, col + x
                        if 0 <= new_row < self.size and 0 <= new_col < self.size:
                            if self.board[row][col] == self.board[new_row][new_col]:
                                same_value_locations.append((new_row, new_col))
                                if len(same_value_locations) == self.num - 1:
                                    self.board[row][col] *= self.num
                                    self.score += self.board[row][col]
                                    for y_coord, x_coord in same_value_locations:
                                        self.board[y_coord][x_coord] = 0

        if old_board != self.board:
            print("Merging...\n")
            time.sleep(1)
            self.display()
        return old_board != self.board

    def can_move(self):
        for row in range(self.size):
            for col in range(self.size):
                if self.board[row][col] == 0:
                    return True
                if row < self.size - (self.num - 1):
                    loop_broken = False
                    for i in range(1, self.num):
                        if self.board[row + i][col] != self.board[row][col]:
                            loop_broken = True
                            break
                    if not loop_broken:
                        return True
                if col < self.size - (self.num - 1):
                    loop_broken = False
                    for j in range(1, self.num):
                        if self.board[row][col + j] != self.board[row][col]:
                            loop_broken = True
                            break
                    if not loop_broken:
                        return True
        return False

    def display(self):
        print(f'Score: {self.score}')
        for row in self.board:
            print(' '.join([f'{str(col):<5}' for col in row]))
            print()
        print()

    def play(self):
        bindings = {
            'w': self.move_up,
            's': self.move_down,
            'a': self.move_left,
            'd': self.move_right
        }

        while True:
            self.display()
            while self.merge_cells():
                pass
            move = input("Enter a direction (w/a/s/d): ")
            if move in bindings.keys():
                valid_move = bindings[move]()
                if valid_move:
                    if self.post_merge:
                        while self.merge_cells():
                            pass
                    if not self.can_move():
                        self.display()
                        print("Game over!")
                        break
                    self.add_new_tile()
                else:
                    print("Invalid move - move provided must change ths state of the board")
                    time.sleep(2)
                print("\n---\n")
            else:
                print("Invalid move - only w/a/s/d allowed")
                time.sleep(2)


game6561 = Board(3, 5, True)
game6561.score = 17217
game6561.board = [
    [2187, 2187, 81, 3, 3],
    [9, 9, 0, 0, 0],
    [3, 0, 0, 0, 0],
    [3, 0, 0, 3, 0],
    [0, 0, 0, 0, 0]
]
game6561.play()
