/* ************************************************ */
/*                                                  */
/*                   CRABSTACK                      */
/*                                                  */
/*  To play, run the query crabStack/0.             */
/*  Available game modes include:                   */
/*     - Human vs Human                             */
/*     - Human vs Computer                          */
/*     - Computer vs Computer                       */
/*                                                  */
/* ************************************************ */

:- [cs_board, cs_menus, cs_utilities, cs_ai].
:- use_module(library(random)).

/* ************************************************ */
/*                                                  */
/*                   Game Launcher                  */
/*                                                  */
/* ************************************************ */

crabStack:-
        mainMenu.

/* ************************************************ */
/*                                                  */
/*                 Main Game Logic                  */
/*                                                  */
/* ************************************************ */

playGamePvP :-
        play('human', g, 'human', r).
        
playGamePvB :-
        play('human', g, 'computer', r).   
        
playGameBvB :-
        play('computer', g, 'computer', r).


/* ************************************************ */
/*                                                  */
/*   play/{5, 6, 7}                                 */
/*      +Arg 1:   the board                         */
/*      +Arg 1,2: player 1                          */
/*      +Arg 2,3: player 1's color                  */
/*      +Arg 4: player 1's difficulty               */
/*      +Arg 4,5: player 2                          */
/*      +Arg 5,6: player 2's color                  */
/*      +Arg 7: player 2's difficulty               */
/*   Summary: This function starts the game.        */
/*                                                  */
/* ************************************************ */

%% 1 - calling rule
play('human', P1_Color, 'human', P2_Color) :-
        init_board(Board), !,
        play(Board, 'human', P1_Color, 'human', P2_Color).

%% 1 - calling rule
play('human', P1_Color, 'computer', P2_Color) :-
        init_board(Board), !,
        ask_level(Depth),
        play(Board, 'human', P1_Color, 'computer', P2_Color, Depth).

%% 1 - calling rule
play('computer', P1_Color, 'computer', P2_Color) :-
        init_board(Board), !,
        ask_level(Depth1, Depth2),
        play(Board, 'computer', P1_Color, Depth1, 'computer', P2_Color, Depth2).

%% 1 - base case: game has been won
play(Board, _, _, _, _) :-
        game_over(Board, Winner),
        print_board(Board),
        print_winner(Winner).

%% 2 - recursive: game not over
play(Board, 'human', P1_Color, 'human', P2_Color) :-
        \+ game_over(Board, _),
        print_board(Board),
        make_move(Board, 'human', P1_Color, FinalBoard), !,
        play(FinalBoard, 'human', P2_Color, 'human', P1_Color).

%% 1 - base case: game has been won
play(Board, _, _, _, _, _) :-
        game_over(Board, Winner),
        print_board(Board),
        print_winner(Winner).

%% 2 - recursive: game not over
play(Board, 'human', P1_Color,'computer', P2_Color, Depth) :-
        \+ game_over(Board, _),
        print_board(Board),
        make_move(Board, 'human', P1_Color, FinalBoard), !,
        display_board(FinalBoard),
        move_computer(FinalBoard, P2_Color, Depth, Computer_FinalBoard),
        play(Computer_FinalBoard, 'human', P1_Color, 'computer', P2_Color, Depth).

%% 1 - base case: game has been won
play(Board, _, _, _, _, _, _) :-
        game_over(Board, Winner),
        print_board(Board),
        print_winner(Winner).

%% 2 - recursive: game not over
play(Board, 'computer', P1_Color, Depth1, 'computer', P2_Color, Depth2) :-
        \+ game_over(Board, _),
        display_board(Board),
        move_computer(Board, P1_Color, Depth1, Computer1_FinalBoard),
        play(Computer1_FinalBoard, 'computer', P2_Color, Depth2, 'computer', P1_Color, Depth1).


/* ************************************************ */
/*                                                  */
/*   make_move/4                                    */
/*      +Arg 1: the hex board                       */
/*      +Arg 2: the player                          */
/*      +Arg 3: the player's color                  */
/*      -Arg 4: final board                         */
/*   Summary: Puts a stone of the specified color   */
/*            on the specified tile of the game     */
/*            board.                                */
/*                                                  */
/* ************************************************ */

make_move(Board, Player, Player_Color, FinalBoard) :-
        choose_tile(Board, Player, Player_Color, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   choose_tile/4                                  */
/*      +Arg 1: the hex board                       */
/*      +Arg 2: the player                          */
/*      +Arg 3: the player's color                  */
/*      -Arg 4: final board                         */
/*   Summary: Allows the player to choose a tile to */
/*            play.                                 */
/*                                                  */
/* ************************************************ */

choose_tile(Board, human, Player_Color, FinalBoard) :-
        repeat,
        color(Player_Color, Color_Text),
        format('~s''s turn.', Color_Text),
        nl,
        print('Select tile''s piece: '),
        read(Rock_Init),
        print('Select tile''s destination: '),
        read(Rock),
        legalMove(Board, Rock_Init, Rock, Player_Color, FinalBoard).

        
/* ************************************************ */
/*                                                  */
/*   legalMove/5                                    */
/*      +Arg 1: actual board                        */
/*      +Arg 2: initial rock                        */
/*      +Arg 3: destination rock                    */
/*      +Arg 4: player color                        */
/*      -Arg 5: final board                         */
/*   Summary: Determines if a tile can legally be   */
/*            played.                               */
/*                                                  */
/* ************************************************ */
        
legalMove(Board, Rock_Init, Rock, Player_Color, FinalBoard) :-
        Rock_Init \= Rock,
        in_range(Rock_Init),
        in_range(Rock),
        get_rock(Rock_Init, Board, Crab),
        crab_stats(Crab, Crab_Size, Crab_Color),
        Crab_Color == Player_Color, %% Checks if the crab belongs to the player
        valid_crab_movement(Board, Rock_Init, Rock, Crab, Crab_Size, FinalBoard).
        

/* ************************************************ */
/*                                                  */
/*   valid_crab_movement/6                          */
/*      +Arg 1: actual board                        */
/*      +Arg 2: initial rock                        */
/*      +Arg 3: destination rock                    */
/*      +Arg 4: the crab (eg. M1)                   */
/*      +Arg 5: crab size                           */
/*      -Arg 6: final board                         */
/*   Summary: Determines if a crab movement is      */
/*            valid.                                */
/*                                                  */
/* ************************************************ */

valid_crab_movement(Board, Rock_Init, Rock, Crab, Crab_Size, FinalBoard):-
        dist(Crab_Size, Rock_Init, Valid_Moves),
        member(Rock, Valid_Moves), %% valid distance for crab size
        get_rock(Rock, Board, Crab_Top),
        crab_stats(Crab_Top, Crab_Top_Size, _),
        valid_pile_crab(Crab_Size, Crab_Top_Size),
        update_board(Board, Rock, Rock_Init, Crab, FinalBoard).
        

/* ************************************************ */
/*                                                  */
/*   update_board/5                                 */
/*      +Arg 1: actual board                        */
/*      +Arg 2: destination rock                    */
/*      +Arg 3: initial rock                        */
/*      +Arg 4: the crab (eg. M1)                   */
/*      -Arg 5: final board                         */
/*   Summary: Updates the borad with the crab       */
/*            movement.                             */
/*                                                  */
/* ************************************************ */

update_board(Board, Rock, Rock_Init, Crab, FinalBoard):-
        add_crab_board(Board, Rock, Crab, FinalTemp),
        remove_crab_board(FinalTemp, Rock_Init, FinalBoard),
        \+ (wave(FinalBoard, Rock_Init, _)).

update_board(Board, Rock, Rock_Init, Crab, FinalBoard):-
        add_crab_board(Board, Rock, Crab, FinalTemp),
        remove_crab_board(FinalTemp, Rock_Init, Tmp_Board),
        wave(Tmp_Board, Rock_Init, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   add_crab_board/4                               */
/*      +Arg 1: actual board                        */
/*      +Arg 2: rock position                       */
/*      +Arg 3: the crab (eg. M1)                   */
/*      -Arg 4: final board                         */
/*   Summary: Adds the crab to the rock position.   */
/*                                                  */
/* ************************************************ */
        
add_crab_board(Board, Rock, Crab, FinalBoard):-
        (Rock == 1; Rock == 2; Rock == 3),
        addCrab(Board, 1, Rock, Crab, FinalBoard).
        
add_crab_board(Board, Rock, Crab, FinalBoard):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        Col is Rock - 3,
        addCrab(Board, 2, Col, Crab, FinalBoard).
        
add_crab_board(Board, Rock, Crab, FinalBoard):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        Col is Rock - 7,
        addCrab(Board, 3, Col, Crab, FinalBoard).
        
add_crab_board(Board, Rock, Crab, FinalBoard):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        Col is Rock - 11,
        addCrab(Board, 4, Col, Crab, FinalBoard).
        
add_crab_board(Board, Rock, Crab, FinalBoard):-
        (Rock == 16; Rock == 17; Rock == 18),
        Col is Rock - 15,
        addCrab(Board, 5, Col, Crab, FinalBoard).

        
/* ************************************************ */
/*                                                  */
/*   remove_stack_board/3                           */
/*      +Arg 1: actual board                        */
/*      +Arg 2: rock position                       */
/*      -Arg 3: final board                         */
/*   Summary: Removes all crabs of the a rock       */
/*            position.                             */
/*                                                  */
/* ************************************************ */
        
remove_stack_board(Board, Rock, FinalBoard):-
        (Rock == 1; Rock == 2; Rock == 3),
        removeCrabStack(Board, 1, Rock, FinalBoard).
        
remove_stack_board(Board, Rock, FinalBoard):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        Col is Rock - 3,
        removeCrabStack(Board, 2, Col, FinalBoard).
        
remove_stack_board(Board, Rock, FinalBoard):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        Col is Rock - 7,
        removeCrabStack(Board, 3, Col, FinalBoard).

remove_stack_board(Board, Rock, FinalBoard):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        Col is Rock - 11,
        removeCrabStack(Board, 4, Col, FinalBoard).

remove_stack_board(Board, Rock, FinalBoard):-
        (Rock == 16; Rock == 17; Rock == 18),
        Col is Rock - 15,
        removeCrabStack(Board, 5, Col, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   remove_crab_board/3                            */
/*      +Arg 1: actual board                        */
/*      +Arg 2: rock position                       */
/*      -Arg 3: final board                         */
/*   Summary: Removes the top crab of the rock      */
/*            position.                             */
/*                                                  */
/* ************************************************ */
        
remove_crab_board(Board, Rock, FinalBoard):-
        (Rock == 1; Rock == 2; Rock == 3),
        removeCrab(Board, 1, Rock, FinalBoard).
        
remove_crab_board(Board, Rock, FinalBoard):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        Col is Rock - 3,
        removeCrab(Board, 2, Col, FinalBoard).
        
remove_crab_board(Board, Rock, FinalBoard):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        Col is Rock - 7,
        removeCrab(Board, 3, Col, FinalBoard).

remove_crab_board(Board, Rock, FinalBoard):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        Col is Rock - 11,
        removeCrab(Board, 4, Col, FinalBoard).

remove_crab_board(Board, Rock, FinalBoard):-
        (Rock == 16; Rock == 17; Rock == 18),
        Col is Rock - 15,
        removeCrab(Board, 5, Col, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   game_over/2                                    */
/*      +Arg 1: the board                           */
/*      -Arg 2: winner                              */
/*   Summary: Determines if the game is over and    */
/*            if so returns the winner.             */
/*                                                  */
/* ************************************************ */

game_over(Board, r) :-
        moves_left(Board, g, 0, [], 1, Moves, _List_Moves),
        Moves == 0.
        
game_over(Board, g) :-
        moves_left(Board, r, 0, [], 1, Moves, _List_Moves),
        Moves == 0.


/* ************************************************ */
/*                                                  */
/*   moves_left/7                                   */
/*      +Arg 1: the board                           */
/*      +Arg 2: player color                        */
/*      +Arg 3: number of left moves (counter)      */
/*      +Arg 4: list of left moves (counter)        */
/*      +Arg 5: initial position                    */
/*      -Arg 6: number of movements                 */
/*      +Arg 7: list of left moves                  */
/*   Summary: Determines the number of left moves   */
/*            the player can make.                  */
/*                                                  */
/* ************************************************ */

moves_left(_, _, Moves, List_Moves, 19, Moves, List_Moves). % final state

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count \= 1,
        \+ (get_rock(Count, Board, _)),
        New_Count is Count + 1,
        moves_left(Board, Player_Color, Moves, List_Moves_Counter, New_Count, Final_Moves, List_Final_Moves), !.

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count \= 1,
        get_rock(Count, Board, Crab),
        crab_stats(Crab, Crab_Size, Crab_Color),
        Crab_Color == Player_Color, %% Checks if the crab belongs to the player
        check_moves(Board, Count, Crab_Size, 1, Player_Color, Moves, [], Moves_Rock, New_List_Moves),
        New_Count is Count + 1,
                append(New_List_Moves, List_Moves_Counter, NNew_List_Moves),
        moves_left(Board, Player_Color, Moves_Rock, NNew_List_Moves, New_Count, Final_Moves, List_Final_Moves), !.

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count \= 1,
        get_rock(Count, Board, Crab),
        crab_stats(Crab, _, Crab_Color),
        Crab_Color \= Player_Color, %% Checks if the crab belongs to the player
        New_Count is Count + 1,
        moves_left(Board, Player_Color, Moves, List_Moves_Counter, New_Count, Final_Moves, List_Final_Moves), !.

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count == 1,
        \+ (get_rock(Count, Board, _)),
        New_Count is Count + 1,
        moves_left(Board, Player_Color, Moves, List_Moves_Counter, New_Count, Final_Moves, List_Final_Moves), !.

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count == 1,
        get_rock(Count, Board, Crab),
        crab_stats(Crab, Crab_Size, Crab_Color),
        Crab_Color == Player_Color, %% Checks if the crab belongs to the player
        check_moves(Board, Count, Crab_Size, 2, Player_Color, Moves, [], Moves_Rock, New_List_Moves),
        New_Count is Count + 1,
                append(New_List_Moves, List_Moves_Counter, NNew_List_Moves),
        moves_left(Board, Player_Color, Moves_Rock, NNew_List_Moves, New_Count, Final_Moves, List_Final_Moves), !.

moves_left(Board, Player_Color, Moves, List_Moves_Counter, Count, Final_Moves, List_Final_Moves):-
        Count == 1,
        get_rock(Count, Board, Crab),
        crab_stats(Crab, _, Crab_Color),
        Crab_Color \= Player_Color, %% Checks if the crab belongs to the player
        New_Count is Count + 1,
        moves_left(Board, Player_Color, Moves, List_Moves_Counter, New_Count, Final_Moves, List_Final_Moves), !.


/* ************************************************ */
/*                                                  */
/*   check_moves/9                                  */
/*      +Arg 1: the board                           */
/*      +Arg 2: initial position                    */
/*      +Arg 3: size of initial position crab       */
/*      +Arg 4: final position                      */
/*      +Arg 5: player color                        */
/*      +Arg 6: number of movements (counter)       */
/*      +Arg 7: list of movements (counter)         */
/*      -Arg 8: number of movements                 */
/*      -Arg 9: list of movements                   */
/*   Summary: Determines the number of left moves   */
/*            the player can make on the            */
/*            initial position.                     */
/*                                                  */
/* ************************************************ */
        
check_moves(_, 17, _, 19, _, Moves, ListMoves, Moves, ListMoves).

check_moves(_, _, _, 19, _, Moves, ListMoves, Moves, ListMoves).

check_moves(Board, Init_Pos, Init_Crab_Size, Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock):-
        Init_Pos \= Final_Pos,
        get_rock(Final_Pos, Board, Final_Crab),
        crab_stats(Final_Crab, Final_Crab_Size, _),
        valid_pile_crab(Init_Crab_Size, Final_Crab_Size),
        dist(Init_Crab_Size, Init_Pos, Valid_Moves),
        member(Final_Pos, Valid_Moves), %% valid distance for crab size
        New_Moves is Moves + 1,
        New_Final_Pos is Final_Pos + 1,
        check_moves(Board, Init_Pos, Init_Crab_Size, New_Final_Pos, Player_Color, New_Moves, [[Init_Pos, Final_Pos] | ListMoves], Moves_Rock, List_Moves_Rock), !.

check_moves(Board, Init_Pos, Init_Crab_Size, Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock):-
        Init_Pos \= Final_Pos,
        \+ (get_rock(Final_Pos, Board, _)),
        New_Final_Pos is Final_Pos + 1,
        check_moves(Board, Init_Pos, Init_Crab_Size, New_Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock), !.

check_moves(Board, Init_Pos, Init_Crab_Size, Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock):-
        Init_Pos == Final_Pos,
        New_Final_Pos is Final_Pos + 1,
        check_moves(Board, Init_Pos, Init_Crab_Size, New_Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock).

check_moves(Board, Init_Pos, Init_Crab_Size, Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock):-
        Init_Pos \= Final_Pos,
        get_rock(Final_Pos, Board, Final_Crab),
        crab_stats(Final_Crab, Final_Crab_Size, _),
        \+ (valid_pile_crab(Init_Crab_Size, Final_Crab_Size)),
        New_Final_Pos is Final_Pos + 1,
        check_moves(Board, Init_Pos, Init_Crab_Size, New_Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock), !.

check_moves(Board, Init_Pos, Init_Crab_Size, Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock):-
        Init_Pos \= Final_Pos,
        get_rock(Final_Pos, Board, Final_Crab),
        crab_stats(Final_Crab, Final_Crab_Size, _),
        valid_pile_crab(Init_Crab_Size, Final_Crab_Size),
        dist(Init_Crab_Size, Init_Pos, Valid_Moves),
        \+ (member(Final_Pos, Valid_Moves)), %% valid distance for crab size
        New_Final_Pos is Final_Pos + 1,
        check_moves(Board, Init_Pos, Init_Crab_Size, New_Final_Pos, Player_Color, Moves, ListMoves, Moves_Rock, List_Moves_Rock), !.
        
        
/* ************************************************ */
/*                                                  */
/*   in_range/1                                     */
/*      +Arg 1: the tile                            */
/*   Summary: Determines if the tile is in the      */
/*            playable range of tiles.              */
/*                                                  */
/* ************************************************ */

in_range(Tile) :-
        integer(Tile),
        Tile > 0,
        Tile < 19.


/* ************************************************ */
/*                                                  */
/*                   Game Rules                     */
/*                                                  */
/* ************************************************ */

/* ************************************************ */
/*                                                  */
/*   dist/3                                         */
/*      +Arg 1: crab size                           */
/*      +Arg 2: crab position                       */
/*      -Arg 3: list of possible moves              */
/*   Summary: Determines the positions that a crab  */
/*            can go given it's size and position.  */
/*                                                  */
/* ************************************************ */
check(Rocks):-
	init_board(Board),
	print_board(Board),
	dist_crab(Board, b, 4, Rocks).
	
dist_crab(Board, Size, Rock, Rocks):-
	dist(Size, Rock, AllRocks),
	check_dist(Board, Size, AllRocks, [], Rocks).
	
	
check_dist(_, _, [], Rocks, Rocks).

	
check_dist(Board, Size, [H|AllRocks], TmpRocks, Rocks):-
	get_rock(H, Board, Crab),
	crab_stats(Crab, Size2, _),
	valid_pile_crab(Size, Size2),
	check_dist(Board, Size, AllRocks, [H|TmpRocks], Rocks).

check_dist(Board, Size, [H|AllRocks], TmpRocks, Rocks):-
	\+ get_rock(H, Board, _),
	check_dist(Board, Size, AllRocks, TmpRocks, Rocks).
	
check_dist(Board, Size, [H|AllRocks], TmpRocks, Rocks):-
	get_rock(H, Board, Crab),
	crab_stats(Crab, Size2, _),
	\+ valid_pile_crab(Size, Size2),
	check_dist(Board, Size, AllRocks, TmpRocks, Rocks).
	

dist(b, 1, [2, 4, 5]).
dist(m, 1, [2, 3, 4, 5, 6, 8, 9]).
dist(s, 1, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13]).

dist(b, 2, [1, 3, 5, 6]).
dist(m, 2, [1, 3, 4, 5, 6, 7, 9, 10]).
dist(s, 2, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).

dist(b, 3, [2, 6, 7]).
dist(m, 3, [1, 2, 5, 6, 7, 10, 11]).
dist(s, 3, [1, 2, 4, 5, 6, 7, 9, 10, 11, 14, 15]).

dist(b, 4, [1, 5, 8, 9]).
dist(m, 4, [1, 2, 5, 6, 8, 9, 12, 13]).
dist(s, 4, [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17]).

dist(b, 5, [1, 2, 4, 6, 9]).
dist(m, 5, [1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13]).
dist(s, 5, [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]).

dist(b, 6, [2, 3, 5, 7, 10]).
dist(m, 6, [1, 2, 3, 4, 5, 7, 9, 10, 11, 14, 15]).
dist(s, 6, [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18]).

dist(b, 7, [3, 6, 10, 11]).
dist(m, 7, [2, 3, 5, 6, 10, 11, 14, 15]).
dist(s, 7, [1, 2, 3, 4, 5, 6, 9, 10, 11, 13, 14, 15, 17, 18]).

dist(b, 8, [4, 9, 12]).
dist(m, 8, [1, 4, 5, 9, 12, 13, 16]).
dist(s, 8, [1, 2, 4, 5, 6, 9, 12, 13, 14, 16, 17]). 

dist(b, 9, [4, 5, 8, 12, 13]).
dist(m, 9, [1, 2, 4, 5, 6, 8, 12, 13, 14, 16, 17]).
dist(s, 9, [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 15, 16, 17, 18]).

dist(b, 10, [6, 7, 11, 14, 15]).
dist(m, 10, [2, 3, 5, 6, 7, 11, 13, 14, 15, 17, 18]).
dist(s, 10, [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18]).

dist(b, 11,  [7, 10, 15]).
dist(m, 11,  [3, 6, 7, 10, 14, 15, 17, 18]).
dist(s, 11,  [2, 3, 5, 6, 7, 10, 13, 14, 15, 17, 18]).
        
dist(b, 12,  [8, 9, 13, 16]).
dist(m, 12,  [4, 5, 8, 9, 13, 14, 16, 17]).
dist(s, 12,  [1, 2, 4, 5, 6, 8, 9, 10, 13, 14, 15, 16, 17, 18]).

dist(b, 13,  [9, 12, 14, 16, 17]).
dist(m, 13,  [4, 5, 8, 9, 10, 12, 14, 15, 16, 17, 18]).
dist(s, 13,  [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18]).

dist(b, 14,  [10, 13, 15, 17, 18]).
dist(m, 14,  [6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 18]).
dist(s, 14,  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18]).

dist(b, 15,  [10, 11, 14, 18]).
dist(m, 15,  [6, 7, 10, 11, 13, 14, 17, 18]).
dist(s, 15,  [2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 18]).

dist(b, 16,  [12, 13, 17]).
dist(m, 16,  [8, 9, 12, 13, 14, 17, 18]).
dist(s, 16,  [4, 5, 8, 9, 10, 12, 13, 14, 15, 17, 18]).

dist(b, 17,  [13, 14, 16, 18]).
dist(m, 17,  [9, 10, 12, 13, 14, 15, 16, 18]).
dist(s, 17,  [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18]).

dist(b, 18,  [14, 15, 17]).
dist(m, 18,  [10, 11, 13, 14, 15, 16, 17]).
dist(s, 18,  [6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17]).


/* ************************************************ */
/*                                                  */
/*   water_limiit/1                                 */
/*      ?Arg 1: rocks with water as neighbor        */
/*   Summary: Defines the rocks that are neighbors  */
/*            of the water.                         */
/*                                                  */
/* ************************************************ */

water_limit([5, 6, 9, 10, 13, 14]).


/* ************************************************ */
/*                                                  */
/*   limiit/1                                       */
/*      ?Arg 1: rocks in the limit of the board     */
/*   Summary: Defines the rocks that are in the     */
/*            limit of the board.                   */
/*                                                  */
/* ************************************************ */

limit([1, 2, 3, 4, 7, 8, 11, 12, 15, 16, 17, 18]).
        

/* ************************************************ */
/*                                                  */
/*   line/1                                         */
/*      ?Arg 1: line of the board                   */
/*   Summary: Defines a horizontal line of the      */
/*            board.                                */
/*                                                  */
/* ************************************************ */

line([1, 2, 3]).
line([4, 5, 6, 7]).
line([8, 9, 10, 11]).
line([12, 13, 14, 15]).
line([16, 17, 18]).


/* ************************************************ */
/*                                                  */
/*   valid_pile_crab/2                              */
/*      +Arg 1: Crab to be moved size               */
/*      +Arg 2: Crab on top of rock size            */
/*   Summary: Determines if a tile can legally be   */
/*            played.                               */
/*                                                  */
/* ************************************************ */
        
valid_pile_crab(s, s).
valid_pile_crab(m, s).
valid_pile_crab(m, m).
valid_pile_crab(b, s).
valid_pile_crab(b, m).
valid_pile_crab(b, b).


/* ************************************************ */
/*                                                  */
/*   get_empty_board_limits/3                       */
/*      +Arg 1: board                               */
/*      +Arg 2: position                            */
/*      -Arg 3: empty position neighbors board      */
/*              limits                              */
/*   Summary: Determines the empty position         */
/*            neighbors board limits.               */
/*                                                  */
/* ************************************************ */

get_empty_board_limits(Board, Position, EmptyLimits):-
        dist(b, Position, Big_Limits),
        empty_neighbors(Board, Big_Limits, [], Empty_Big_Limits),
        length(Empty_Big_Limits, Num_Empties),
        Num_Empties \= 0,
        limit(Board_Limits),
        intersection(Empty_Big_Limits, Board_Limits, EmptyLimits).


/* ************************************************ */
/*                                                  */
/*   get_empty_water_limits/3                       */
/*      +Arg 1: board                               */
/*      +Arg 2: position                            */
/*      -Arg 3: empty position neighbors water      */
/*              limits                              */
/*   Summary: Determines the empty position         */
/*            neighbors water limits.               */
/*                                                  */
/* ************************************************ */

get_empty_water_limits(Board, Position, EmptyLimits):-
        dist(b, Position, Big_Limits),
        empty_neighbors(Board, Big_Limits, [], Empty_Big_Limits),
        length(Empty_Big_Limits, Num_Empties),
        Num_Empties \= 0,
        water_limit(WLimits),
        intersection(Empty_Big_Limits, WLimits, EmptyLimits).


/* ************************************************ */
/*                                                  */
/*   get_final_position_limits/4                    */
/*      +Arg 1: board                               */
/*      +Arg 2: initial position empty limits       */
/*      +Arg 3: water limits                        */
/*      -Arg 4: empty positions of water neighbors  */
/*              board limits                        */
/*   Summary: Determines the empty positions of     */
/*            water neighbors board limits.         */
/*                                                  */
/* ************************************************ */

get_final_position_limits(_, _, [], []).

get_final_position_limits(Board, Init_EmptyLimits, [HWLimits|TWLimits], FinalPositions):-
        get_rock(HWLimits, Board, _),
        get_final_position_limits(Board, Init_EmptyLimits, TWLimits, FinalPositions), !.

get_final_position_limits(Board, Init_EmptyLimits, [HWLimits|TWLimits], FinalPositions):-
        \+ (get_rock(HWLimits, Board, _)),
        get_empty_board_limits(Board, HWLimits, Final_EmptyLimits),
        append(Init_EmptyLimits, Final_EmptyLimits, EmptyLimits),
        intersection(Init_EmptyLimits, Final_EmptyLimits, Duplicates),
        delete_all_list(Duplicates, EmptyLimits, L),
        length(L, Num_FinalPositions),
        Num_FinalPositions < 2,
        get_final_position_limits(Board, Init_EmptyLimits, TWLimits, FinalPositions), !.

get_final_position_limits(Board, Init_EmptyLimits, [HWLimits|_TWLimits], FinalPositions):-
        \+ (get_rock(HWLimits, Board, _)),
        get_empty_board_limits(Board, HWLimits, Final_EmptyLimits),
        append(Init_EmptyLimits, Final_EmptyLimits, EmptyLimits),
        intersection(Init_EmptyLimits, Final_EmptyLimits, Duplicates),
        delete_all_list(Duplicates, EmptyLimits, Tmp_FinalPositions),
        length(Tmp_FinalPositions, Num_FinalPositions),
        Num_FinalPositions >= 2,
        append(Tmp_FinalPositions, [HWLimits], FinalPositions).


/* ************************************************ */
/*                                                  */
/*   wave/3                                         */
/*      +Arg 1: board                               */
/*      +Arg 2: initial position                    */
/*      +Arg 3: final board                         */
/*   Summary: Determines if a tile can legally be   */
/*            played.                               */
/*                                                  */
/* ************************************************ */

% initial position is a water limit
wave(Board, Init_Pos, FinalBoard):-
        \+ (get_rock(Init_Pos, Board, _)), % empty pile
        water_limit(WLimits),
        member(Init_Pos, WLimits),
        get_empty_board_limits(Board, Init_Pos, Init_EmptyLimits),
        length(Init_EmptyLimits, Num_Init_EmptyLimits),
        Num_Init_EmptyLimits \= 0,
        delete(WLimits, Init_Pos, New_WLimits),
        get_final_position_limits(Board, Init_EmptyLimits, New_WLimits, FinalPositions),
        length(FinalPositions, Num_FinalPositions),
        Num_FinalPositions >= 2,
        wave_wash_crabs(Board, FinalBoard).

% initial position is a board limit
wave(Board, Init_Pos, FinalBoard):-
        \+ (get_rock(Init_Pos, Board, _)), % empty pile
        limit(Board_Limits),
        member(Init_Pos, Board_Limits),
        get_empty_water_limits(Board, Init_Pos, WLimit),
        water_limit(WLimits),
        delete(WLimits, WLimit, New_WLimits),
        get_final_position_limits(Board, [Init_Pos], New_WLimits, FinalPositions),
        length(FinalPositions, Num_FinalPositions),
        Num_FinalPositions >= 2,
        wave_wash_crabs(Board, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   get_occupied_rocks/4                           */
/*      +Arg 1: board                               */
/*      +Arg 2: counter                             */
/*      +Arg 3: occupied rocks counter              */
/*      -Arg 4: occupied rocks                      */
/*   Summary: Gets the rocks with crabs.            */
/*                                                  */
/* ************************************************ */

get_occupied_rocks(_, 19, RocksCounter, OccupiedRocks):-
        reverse(RocksCounter, OccupiedRocks).

get_occupied_rocks(Board, Counter, RocksCounter, OccupiedRocks):-
        get_rock(Counter, Board, _),
        New_Counter is Counter + 1,
        get_occupied_rocks(Board, New_Counter, [Counter | RocksCounter], OccupiedRocks), !.

get_occupied_rocks(Board, Counter, RocksCounter, OccupiedRocks):-
        \+(get_rock(Counter, Board, _)),
        New_Counter is Counter + 1,
        get_occupied_rocks(Board, New_Counter, RocksCounter, OccupiedRocks), !.
        

/* ************************************************ */
/*                                                  */
/*   all_neighbors/3                                */
/*      +Arg 1: group of rocks                      */
/*      +Arg 2: counter for neighbors of the rocks  */
/*      -Arg 3: neighbors                           */
/*   Summary: Determines all the neighbors of a     */
/*            group of rocks.                       */
/*                                                  */
/* ************************************************ */

all_neighbors([], Neighbors, Neighbors).

all_neighbors([HGroup|TGroup], Neighbors_Counter, Neighbors):-
        dist(b, HGroup, NeighborsGroup),
        append(NeighborsGroup, Neighbors_Counter, New_Neighbors_Counter),
        all_neighbors(TGroup, New_Neighbors_Counter, Neighbors),!.


/* ************************************************ */
/*                                                  */
/*   create_groups/5                                */
/*      +Arg 1: occupied rocks                      */
/*      +Arg 2: counter for group 1                 */
/*      +Arg 3: counter for group 2                 */
/*      -Arg 4: crab group 1                        */
/*      -Arg 5: crab group 2                        */
/*   Summary: Creates board 2 groups of crabs       */
/*            given a split line.                   */
/*                                                  */
/* ************************************************ */

create_groups([], Group1, Group2, Group1, Group2).

create_groups([HOccupiedRocks|TOccupiedRocks], Counter1, Counter2, Group1, Group2):-
        all_neighbors(Counter1, [], GroupNeighbors),
        member(HOccupiedRocks, GroupNeighbors),
        append(Counter1, [HOccupiedRocks], New_Counter1),
        create_groups(TOccupiedRocks, New_Counter1, Counter2, Group1, Group2), !.
    
create_groups([HOccupiedRocks|TOccupiedRocks], Counter1, Counter2, Group1, Group2):-
        all_neighbors(Counter2, [], GroupNeighbors),
        length(Counter2, N),
        (member(HOccupiedRocks, GroupNeighbors); N == 0), 
        append(Counter2, [HOccupiedRocks], New_Counter2),
        create_groups(TOccupiedRocks, Counter1, New_Counter2, Group1, Group2), !.

create_groups([HOccupiedRocks|TOccupiedRocks], Counter1, Counter2, Group1, Group2):-
        all_neighbors(Counter1, [], GroupNeighbors1),
        all_neighbors(Counter2, [], GroupNeighbors2),
        \+ member(HOccupiedRocks, GroupNeighbors1), 
        \+ member(HOccupiedRocks, GroupNeighbors2), 
        append(TOccupiedRocks, [HOccupiedRocks], ToLastOccupied),
        create_groups(ToLastOccupied, Counter1, Counter2, Group1, Group2), !.
        
    
/* ************************************************ */
/*                                                  */
/*   split_groups/3                                 */
/*      +Arg 1: board                               */
/*      -Arg 2: crab group 1                        */
/*      -Arg 3: crab group 2                        */
/*   Summary: Splits the board into 2 groups of     */
/*            crabs given a split line.             */
/*                                                  */
/* ************************************************ */

split_groups(Board, Group1, Group2):-
        get_occupied_rocks(Board, 1, [], [FirstRock|OccupiedRocks]),
        create_groups(OccupiedRocks, [FirstRock], [], Group1, Group2).


/* ************************************************ */
/*                                                  */
/*   count_group_crabs/4                            */
/*      +Arg 1: board                               */
/*      +Arg 2: crab group                          */
/*      +Arg 3: counter                             */
/*      -Arg 4: number of crabs in the group        */
/*   Summary: Counts the number of crabs in the     */
/*            group.                                */
/*                                                  */
/* ************************************************ */

count_group_crabs(_, [], Num, Num).

count_group_crabs(Board, [HGroup | TGroup], Counter, Num):-
        count_stack(HGroup, Board, NumCrabs),
        New_Counter is Counter + NumCrabs,
        count_group_crabs(Board, TGroup, New_Counter, Num).


/* ************************************************ */
/*                                                  */
/*   ask_wave/3                                     */
/*      +Arg 1: crab group 1                        */
/*      +Arg 2: crab group 2                        */
/*      -Arg 3: selected crab group                 */
/*   Summary: The player selects crab group.        */
/*                                                  */
/* ************************************************ */

ask_wave(Group1, Group2, Selected_Group):-
        repeat,
        print('1 - '), print(Group1), nl,
        print('2 - '), print(Group2), nl,
        print('Select group to wash away: '),
        read(Group),
        integer(Group),
        (Group == 1, Selected_Group = Group1; Group == 2, Selected_Group = Group2).


/* ************************************************ */
/*                                                  */
/*   weakest_group/4                                */
/*      +Arg 1: board                               */
/*      +Arg 2: crab group 1                        */
/*      +Arg 3: crab group 2                        */
/*      -Arg 4: weakest crab group                  */
/*   Summary: selects the weakest crab group.       */
/*                                                  */
/* ************************************************ */

weakest_group(_Board, Group1, Group2, Group2):-
        length(Group1, Num_Group1),
        length(Group2, Num_Group2),
        Num_Group1 > Num_Group2.

weakest_group(_Board, Group1, Group2, Group1):-
        length(Group1, Num_Group1),
        length(Group2, Num_Group2),
        Num_Group1 < Num_Group2.

weakest_group(Board, Group1, Group2, Group2):-
        length(Group1, Num_Group1),
        length(Group2, Num_Group2),
        Num_Group1 == Num_Group2,
        count_group_crabs(Board, Group1, 0, Num_Crabs1),
        count_group_crabs(Board, Group2, 0, Num_Crabs2),
        Num_Crabs1 > Num_Crabs2.

weakest_group(Board, Group1, Group2, Group1):-
        length(Group1, Num_Group1),
        length(Group2, Num_Group2),
        Num_Group1 == Num_Group2,
        count_group_crabs(Board, Group1, 0, Num_Crabs1),
        count_group_crabs(Board, Group2, 0, Num_Crabs2),
        Num_Crabs1 < Num_Crabs2.

weakest_group(Board, Group1, Group2, Selected_Group):-
        length(Group1, Num_Group1),
        length(Group2, Num_Group2),
        Num_Group1 == Num_Group2,
        count_group_crabs(Board, Group1, 0, Num_Crabs1),
        count_group_crabs(Board, Group2, 0, Num_Crabs2),
        Num_Crabs1 == Num_Crabs2,
        ask_wave(Group1, Group2, Selected_Group).


/* ************************************************ */
/*                                                  */
/*   remove_wave/3                                  */
/*      +Arg 1: actual board                        */
/*      +Arg 2: group to remove                     */
/*      -Arg 3: final board                         */
/*   Summary: Removes a group of crabs of a given   */
/*            board                                 */
/*                                                  */
/* ************************************************ */

remove_wave(FinalBoardWave, [], FinalBoardWave).

remove_wave(Board, [HRock|TRock], FinalBoardWave):-
        remove_stack_board(Board, HRock, FinalBoard),
        remove_wave(FinalBoard, TRock, FinalBoardWave).


/* ************************************************ */
/*                                                  */
/*   wave_wash_crabs/2                              */
/*      +Arg 1: board                               */
/*      -Arg 2: final board                         */
/*   Summary: Washes away the smallest crab group.  */
/*                                                  */
/* ************************************************ */

wave_wash_crabs(Board, FinalBoard):-
        split_groups(Board, Group1, Group2),
        weakest_group(Board, Group1, Group2, Weakest),
        remove_wave(Board, Weakest, FinalBoard).


/* ************************************************ */
/*                                                  */
/*   empty_neighbors/4                              */
/*      +Arg 1: board                               */
/*      +Arg 2: neighbors positions                 */
/*      +Arg 3: counter for empty positions         */
/*      -Arg 4: empty neighbor positions            */
/*   Summary: Determines the empty neighbor         */
/*            positions.                            */
/*                                                  */
/* ************************************************ */
        
empty_neighbors(_, [], Count, Empties):-
        reverse(Count, Empties).
        
empty_neighbors(Board, [HPositions | TPositions], Count, Empties):-
        \+ (get_rock(HPositions, Board, _)),
        empty_neighbors(Board, TPositions, [HPositions|Count], Empties), !.
        
empty_neighbors(Board, [HPositions | TPositions], Count, Empties):-
        get_rock(HPositions, Board, _),
        empty_neighbors(Board, TPositions, Count, Empties), !.
        

/* ************************************************ */
/*                                                  */
/*                Auxiliar Functions                */
/*                                                  */
/* ************************************************ */


/* ************************************************ */
/*   color/2                                        */
/*      +Arg 1: the color (g or r)                  */
/*      -Arg 2: text representation                 */
/*   Summary: Returns a string representation of    */
/*            the color.                            */
/*                                                  */
/* ************************************************ */

color(g, 'Green').
color(r, 'Red').


/* ************************************************ */
/*                                                  */
/*   print_winner/1                                 */
/*      +Arg 1: the winner                          */
/*   Summary: A utility function to print the       */
/*            winner of the game.                   */
/*                                                  */
/* ************************************************ */

print_winner(Winner) :-
        color(Winner, Winning_Color),
        random(1, 7, X),
        msg(X, S),
        format('~2n~s ~s wins.', [S, Winning_Color]),
        nl,
        pressEnterToContinue.


/* ************************************************ */
/*                                                  */
/*   print_board/{1/2}                              */
/*      +Arg 1: the hex board                       */
/*      +Arg 2: the tile color                      */
/*   Summary: Simply a utility function to otput    */
/*            the board and ask for input.          */
/*            board.                                */
/*                                                  */
/* ************************************************ */

print_board(Board) :-
        nl, nl,
        display_board(Board),
        flush_output(user_output).


/* ************************************************ */
/*                                                  */
/*   msg/2                                          */
/*      +Arg 1: a number                            */
/*      -Arg 2: end game message                    */
/*   Summary: Used to generate a random end-game    */
/*            message to make the game more fun.    */
/*            board.                                */
/*                                                  */
/* ************************************************ */

msg(1, 'Close call, but').
msg(2, 'Well played,').
msg(3, 'Congratulations,').
msg(4, 'Annihalation,').
msg(5, 'That was a slaughter,').
msg(6, 'Pwnt. n00b l0lz.').


/* ************************************************ */
/*                                                  */
/*   next_color                                     */
/*      +Arg 1: current color                       */
/*      -Arg 2: next coloressage                    */
/*   Summary: Gives the next color that will play.  */
/*                                                  */
/* ************************************************ */

next_color(g, b).
next_color(b, g).


/* ************************************************ */
/*                                                  */
/*   crab_stats/3                                   */
/*      +Arg 1: Crab                                */
/*      -Arg 2: Crab size                           */
/*      -Arg 3: Crab color                          */
/*   Summary: determines the crab size and color    */
/*                                                  */
/* ************************************************ */

crab_stats(Crab, s, g):-
        Crab == s1.
        
crab_stats(Crab, m, g):-
        Crab == m1.
        
crab_stats(Crab, b, g):-
        Crab == b1.
        
crab_stats(Crab, s, r):-
        Crab == s2.
        
crab_stats(Crab, m, r):-
        Crab == m2.
        
crab_stats(Crab, b, r):-
        Crab == b2.
        

/* ************************************************ */
/*                  End of program                  */
/* ************************************************ */
