:- use_module(library(lists)).
:- use_module(library(random)).
:- [cs_utilities].

/* ************************************************ */
/*                                                  */
/*   init_board/{1}                                 */
/*                                                  */
/*   Summary: This function starts the game.        */
/*                                                  */
/* ************************************************ */

crabs(['S1', 'S1', 'S1', 'S2', 'S2', 'S2', 'M1', 'M1', 'M1', 'M2', 'M2', 'M2', 'B1', 'B1', 'B1', 'B2', 'B2', 'B2']).


aux_board(Board, Crab, FinalBoard):-
        repeat,
        random(1, 19, Rock),
        \+ (get_rock(Rock, Board, _)),
        add_crab_board(Board, Rock, Crab, FinalBoard).


add_crab_init_board(Board, [], Board).

add_crab_init_board(Board, [HCrabs | TCrabs], FinalBoard):-
        aux_board(Board, HCrabs, Tmp_FinalBoard),
        add_crab_init_board(Tmp_FinalBoard, TCrabs, FinalBoard), !.


init_board(Board):-
        Empty_Board = [ [[],[],[]],
                [[],[],[],[]],
                [[],[],[],[]],
                [[],[],[],[]],
                [[],[],[]]
         ],
        crabs(CrabsList),
        add_crab_init_board(Empty_Board, CrabsList, Board).


draw_space(0).
draw_space(N):- N>0,write(' '), N1 is N-1,draw_space(N1).

draw_top:-
        write('____').

/* ************************************************ */
/*                                                  */
/*   display_board/1                                */
/*      +Arg 1: board                               */
/*   Summary: Prints a given board.                 */
/*                                                  */
/* ************************************************ */

display_board(Board):-
        draw_space(16),
        draw_top,
        nl,
        draw_space(15), write('/3   \\'),draw_space(20),write('| 1:  '),display_stack(1,Board),
        nl,
        draw_space(10), draw_top, write('/      \\'),draw_top, draw_space(15),write('| 2:  '),display_stack(2,Board),
        nl,
        draw_space(9), write('/2   \\'),check_rock(3, Board),write('/7   \\'), draw_space(14),write('| 3:  '),display_stack(3,Board),
        nl,
        draw_space(4),  draw_top, write('/      \\'),draw_top,write('/      \\'),draw_top, draw_space(9),write('| 4:  '),display_stack(4,Board),
        nl,
        draw_space(3), write('/1   \\'),check_rock(2,Board),write('/6   \\'),check_rock(7, Board),write('/11  \\'),draw_space(8),write('| 5:  '),display_stack(5,Board),
        nl,
        draw_space(2), write('/      \\'), draw_top,write('/      \\'),draw_top,write('/      \\'),draw_space(7),write('| 6:  '),display_stack(6,Board),
        nl,
        draw_space(2),write('\\'), check_rock(1, Board), write('/5   \\'),check_rock(6, Board),write('/10  \\'),check_rock(11, Board),write('/'),draw_space(7),write('| 7:  '),display_stack(7,Board),
        nl,
        draw_space(3),write('\\'), draw_top,write('/      \\'),draw_top,write('/      \\'),draw_top,write('/'),draw_space(8),write('| 8:  '),display_stack(8,Board),
        nl,
        draw_space(3), write('/4   \\'),check_rock(5, Board),write('/    \\'),check_rock(10,Board),write('/15  \\'),draw_space(8),write('| 9:  '),display_stack(9,Board),
        nl,
        draw_space(2), write('/      \\'), draw_top,write('/      \\'),draw_top,write('/      \\'),draw_space(7),write('| 10: '),display_stack(10,Board),
        nl,
        draw_space(2),write('\\'), check_rock(4, Board), write('/9   \\      '),write('/14  \\'),check_rock(15, Board),write('/'),draw_space(7),write('| 11: '),display_stack(11,Board),
        nl,
        draw_space(3),write('\\'), draw_top,write('/      \\'),draw_top,write('/      \\'),draw_top,write('/'),draw_space(8),write('| 12: '),display_stack(12,Board),
        nl,
        draw_space(3), write('/8   \\'),check_rock(9, Board),write('/13  \\'),check_rock(14, Board),write('/18  \\'),draw_space(8),write('| 13: '),display_stack(13,Board),
        nl,
        draw_space(2), write('/      \\'), draw_top,write('/      \\'),draw_top,write('/      \\'),draw_space(7),write('| 14: '),display_stack(14,Board),
        nl,
        draw_space(2),write('\\'), check_rock(8, Board), write('/12  \\'),check_rock(13, Board), write('/17  \\'),check_rock(18, Board),write('/'),draw_space(7),write('| 15: '),display_stack(15,Board),
        nl,
        draw_space(3), write('\\'),draw_top, write('/      \\'),draw_top,write('/      \\'),draw_top,write('/'),draw_space(8),write('| 16: '),display_stack(16,Board),
        nl,
        draw_space(8),write('\\'), check_rock(12, Board), write('/16  \\'),check_rock(17, Board),write('/'),draw_space(13),write('| 17: '),display_stack(17,Board),
        nl,
        draw_space(9),write('\\'), draw_top, write('/      \\'),draw_top,write('/'),draw_space(14),write('| 18: '),display_stack(18,Board),
        nl,
        draw_space(14),write('\\'),check_rock(16, Board),write('/'),
        nl,
        draw_space(15),write('\\'),draw_top,write('/'),
        nl.
        

/* ************************************************ */
/*                                                  */
/*   check_rock/2                                   */
/*      +Arg 1: the rock number                     */
/*      +Arg 2: the game board                      */
/*   Summary: Print the top of the pile in the rock */
/*            if the rock is empty prints spaces    */
/*                                                  */
/* ************************************************ */

check_rock(Rock, Board):-
        \+ get_rock(Rock, Board, _),
        write('      '). % empty rock

check_rock(Rock, Board):-
        get_rock(Rock, Board, Tile),
        write('  '),
        write(Tile),
        atom_length(Tile, Size),
        White is 4 - Size,
        draw_space(White).


/* ************************************************ */
/*                                                  */
/*   get_rock/3                                     */
/*      +Arg 1: the rock number                     */
/*      +Arg 2: the game board                      */
/*      -Arg 3: the crab                            */
/*   Summary: Gets the crab on top of the pile      */
/*            on the rock                           */
/*                                                  */
/* ************************************************ */

get_rock(Rock, [H|_], Tile):-
        (Rock == 1; Rock == 2; Rock == 3),
        nth1(Rock, H, E),
        \+ length(E, 0),
        nth1(1, E, Tile).
      
get_rock(Rock, Board, Tile):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        nth1(2, Board, H),
        Index is Rock - 3,
        nth1(Index, H, E),
        \+ length(E, 0),
        nth1(1, E, Tile).
        
get_rock(Rock, Board, Tile):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        nth1(3, Board, H),
        Index is Rock - 7,
        nth1(Index, H, E),
        \+ length(E, 0),
        nth1(1, E, Tile).

get_rock(Rock, Board, Tile):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        nth1(4, Board, H),
        Index is Rock - 11,
        nth1(Index, H, E),
        \+ length(E, 0),
        nth1(1, E, Tile).

get_rock(Rock, Board, Tile):-
        (Rock == 16; Rock == 17; Rock == 18),
        nth1(5, Board, H),
        Index is Rock - 15,
        nth1(Index, H, E),
        \+ length(E, 0),
        nth1(1, E, Tile).


/* ************************************************ */
/*                                                  */
/*   display_stack/2                                */
/*      +Arg 1: the rock number                     */
/*      +Arg 2: the game board                      */
/*   Summary: Prints the stack on a given rock.     */
/*                                                  */
/* ************************************************ */

display_stack(Rock, [H|_]):-
        (Rock == 1; Rock == 2; Rock == 3),
        nth1(Rock, H, E),
        reverse(E, Stack),
        printlist(Stack).
      
display_stack(Rock, Board):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        nth1(2, Board, H),
        Index is Rock - 3,
        nth1(Index, H, E),
        reverse(E, Stack),
        printlist(Stack).
        
display_stack(Rock, Board):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        nth1(3, Board, H),
        Index is Rock - 7,
        nth1(Index, H, E),
        reverse(E, Stack),
        printlist(Stack).

display_stack(Rock, Board):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        nth1(4, Board, H),
        Index is Rock - 11,
        nth1(Index, H, E),
        reverse(E, Stack),
        printlist(Stack).

display_stack(Rock, Board):-
        (Rock == 16; Rock == 17; Rock == 18),
        nth1(5, Board, H),
        Index is Rock - 15,
        nth1(Index, H, E),
        reverse(E, Stack),
        printlist(Stack).


/* ************************************************ */
/*                                                  */
/*   count_stack/3                                  */
/*      +Arg 1: the rock number                     */
/*      +Arg 2: the game board                      */
/*      +Arg 3: number of crabs on the rock         */
/*   Summary: Counts the number of crabs on a given */
/*            rock.                                 */
/*                                                  */
/* ************************************************ */

count_stack(Rock, [H|_], Count):-
        (Rock == 1; Rock == 2; Rock == 3),
        nth1(Rock, H, E),
        length(E, Count).
      
count_stack(Rock, Board, Count):-
        (Rock == 4; Rock == 5; Rock == 6; Rock == 7),
        nth1(2, Board, H),
        Index is Rock - 3,
        nth1(Index, H, E),
        length(E, Count).
        
count_stack(Rock, Board, Count):-
        (Rock == 8; Rock == 9; Rock == 10; Rock == 11),
        nth1(3, Board, H),
        Index is Rock - 7,
        nth1(Index, H, E),
        length(E, Count).

count_stack(Rock, Board, Count):-
        (Rock == 12; Rock == 13; Rock == 14; Rock == 15),
        nth1(4, Board, H),
        Index is Rock - 11,
        nth1(Index, H, E),
        length(E, Count).

count_stack(Rock, Board, Count):-
        (Rock == 16; Rock == 17; Rock == 18),
        nth1(5, Board, H),
        Index is Rock - 15,
        nth1(Index, H, E),
        length(E, Count).


/* ************************************************ */
/*                                                  */
/*   removeCrab/4                                   */
/*      +Arg 1: the game board                      */
/*      +Arg 2: row                                 */
/*      +Arg 3: column                              */
/*      -Arg 4: final board                         */
/*   Summary: Removes a crab on the position (R, C).*/
/*                                                  */
/* ************************************************ */

removeCrab(Board, R, C, FinalBoard) :-
        nth1(R, Board, OldRow, RestRows),   % get the row and the rest
        nth1(C, OldRow, Stack, NewRow),    % we don't care the _Val deleted
        nth1(1, Stack, _Val,  NewStack),
        nth1(C, FinalRow, NewStack, NewRow),    
        nth1(R, FinalBoard, FinalRow, RestRows). 


/* ************************************************ */
/*                                                  */
/*   removeCrabStack/4                              */
/*      +Arg 1: the game board                      */
/*      +Arg 2: row                                 */
/*      +Arg 3: column                              */
/*      -Arg 4: final board                         */
/*   Summary: Removes all crabs on the position     */
/*            (R, C).                               */
/*                                                  */
/* ************************************************ */

removeCrabStack(Board, R, C, FinalBoard) :-
        nth1(R, Board, OldRow, RestRows),   % get the row and the rest
        nth1(C, OldRow, _Stack, NewRow),    % we don't care the _Val deleted
        nth1(C, FinalRow, [], NewRow),  
        nth1(R, FinalBoard, FinalRow, RestRows).


/* ************************************************ */
/*                                                  */
/*   addCrab/4                                      */
/*      +Arg 1: the game board                      */
/*      +Arg 2: row                                 */
/*      +Arg 3: column                              */
/*      -Arg 4: final board                         */
/*   Summary: Adds a crab on the position (R, C).   */
/*                                                  */
/* ************************************************ */

addCrab(Board, R, C, Crab, FinalBoard) :-
        nth1(R, Board, OldRow, RestRows),   % get the row and the rest
        nth1(C, OldRow, _Val, RestRow),    % we don't care the _Val deleted
        nth1(C, OldRow, Val),
        nth1(1, S, Crab, Val),
        nth1(C, NewRow, S, RestRow),
        nth1(R, FinalBoard, NewRow, RestRows).   % insert updated row in rest, get Upd matrix
