/* ************************************************ */
/*                                                  */
/*               Artificial Inteligence             */
/*                                                  */
/* ************************************************ */

:- use_module(library(lists)).
:- [cs_utilities].

/* ************************************************ */
/*                                                  */
/*   number_tile_crab/6                             */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      +Arg 3: crab type                           */
/*      +Arg 4: position of the rock                */
/*      +Arg 5: counter for the crabs               */
/*      -Arg 6: number of type crabs on top of the  */
/*              stacks.                             */
/*   Summary: Determines the number of type crabs   */
/*            on the top of the stacks.             */
/*                                                  */
/* ************************************************ */

number_tile_crab(_, _, _, 19, Total_Number, Total_Number).

number_tile_crab(Board, Player, Type, Pos, Counter, Total_Number):-
	get_rock(Pos, Board, Crab),
	crab_stats(Crab, Crab_Size, Crab_Color),
	Crab_Color == Player, %% Checks if the crab belongs to the player
	Crab_Size == Type,
	New_Counter is Counter + 1,
	New_Pos is Pos + 1,
	number_tile_crab(Board, Player, Type, New_Pos, New_Counter, Total_Number), !.

number_tile_crab(Board, Player, Type, Pos, Counter, Total_Number):-
	New_Pos is Pos + 1,
	number_tile_crab(Board, Player, Type, New_Pos, Counter, Total_Number), !.
	

/* ************************************************ */
/*                                                  */
/*   evaluate_board/3                               */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      -Arg 3: value of the current board          */
/*   Summary: Determines the value of the current   */
/*            board.                                */
/*                                                  */
/* ************************************************ */

evaluate_board(Board, Player, Value):-
        moves_left(Board, Player, 0, [], 1, _Moves, List_Moves),
        length(List_Moves, NumMoves),
        number_tile_crab(Board, Player, 'b', 1, 0, Number_Bigs),
        number_tile_crab(Board, Player, 'm', 1, 0, Number_Mediums),
        number_tile_crab(Board, Player, 's', 1, 0, Number_Smalls),
        Value is NumMoves + Number_Smalls + 2*Number_Mediums + 3*Number_Bigs.


/* ************************************************ */
/*                                                  */
/*   move_computer/4                                */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      +Arg 3: depth                               */
/*      -Arg 4: final board                         */
/*   Summary: Performes a move by the computer.     */
/*                                                  */
/* ************************************************ */

move_computer(Board, Player, Depth, Final_Board) :- 
        alpha_beta(Board, Player, Depth, -200, 200, [Init_Pos, Final_Pos], _),
        get_rock(Init_Pos, Board, Crab),
        update_board(Board, Final_Pos, Init_Pos, Crab, Final_Board),
        nl,
        print('Computer moved crab from '),
        print(Init_Pos),
        print(' to '),
        print(Final_Pos), nl, nl.


/* ************************************************ */
/*                                                  */
/*   alpha_beta/7                                   */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      +Arg 3: depth                               */
/*      +Arg 4: alpha                               */
/*      +Arg 5: beta                                */
/*      -Arg 6: movement to be done                 */
/*      -Arg 7: value of the movement               */
/*   Summary: Determines the best movement for a    */
/*            player given a certain depth.         */
/*                                                  */
/* ************************************************ */

alpha_beta(Board, Player, 0, _Alpha, _Beta, _NoMove, Value) :- 
   evaluate_board(Board, Player, Value).

alpha_beta(Board, Player, Depth, Alpha, Beta, Move, Value) :- 
   Depth > 0, 
   moves_left(Board, Player, 0, [], 1, _Moves, List_Moves),
   Alpha1 is -Beta, %max/min
   Beta1 is -Alpha,
   New_Depth is Depth - 1, %profundidade
   evaluate_and_choose(Board, Player, List_Moves, New_Depth, Alpha1, Beta1, nil, (Move, Value)).

   
/* ************************************************ */
/*                                                  */
/*   evaluate_and_choose/8                          */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      +Arg 3: list of moves                       */
/*      +Arg 4: depth                               */
/*      +Arg 5: alpha                               */
/*      +Arg 6: beta                                */
/*      +Arg 7: record of the actual best movement  */
/*      -Arg 8: best movement                       */
/*   Summary: Determines the best movement for a    */
/*            player given a certain depth and the  */
/*            possible player's moves.              */
/*                                                  */
/* ************************************************ */
   
evaluate_and_choose(Board, Player, [[Pos_Init, Pos_Final] | Moves], Depth, Alpha, Beta, Record, BestMove) :-
	get_rock(Pos_Init, Board, Crab_Top),
	update_board(Board, Pos_Final, Pos_Init, Crab_Top, FinalBoard),
	other_player(Player, OtherPlayer),
	alpha_beta(FinalBoard, OtherPlayer, Depth, Alpha, Beta, _OtherMove, Value),
	Value1 is -Value,
	cutoff(Board, Player, [Pos_Init, Pos_Final], Value1, Depth, Alpha, Beta, Moves, Record, BestMove).
   
evaluate_and_choose(_Board, _Player, [], _Depth, Alpha, _Beta, Move, (Move, Alpha)).


/* ************************************************ */
/*                                                  */
/*   cutoff/10                                      */
/*      +Arg 1: the board                           */
/*      +Arg 2: player                              */
/*      +Arg 3: move                                */
/*      +Arg 4: value of the move                   */
/*      +Arg 5: depth                               */
/*      +Arg 6: alpha                               */
/*      +Arg 7: beta                                */
/*      +Arg 8: list of moves                       */
/*      +Arg 9: record of the actual best movement  */
/*      -Arg 10: best movement and it's value       */
/*   Summary: Implements the cut off of the minimax */
/*            algorithm.                            */
/*                                                  */
/* ************************************************ */

cutoff(_Board, _Player, Move, Value, _Depth, _Alpha, Beta, _Moves, _Record, (Move,Value)) :- 
   Value >= Beta, !.
   
cutoff(Board, Player, Move, Value, Depth, Alpha, Beta, Moves, _Record, BestMove) :- 
   Alpha < Value, Value < Beta, !, 
   evaluate_and_choose(Board, Player, Moves, Depth, Value, Beta, Move, BestMove).
   
cutoff(Board, Player, _Move, Value, Depth, Alpha, Beta, Moves, Record, BestMove) :- 
   Value =< Alpha, !, 
   evaluate_and_choose(Board, Player, Moves, Depth, Alpha, Beta, Record, BestMove).

   
/* ************************************************ */
/*                                                  */
/*   other_player/2                                 */
/*      +Arg 1: current player                      */
/*      +Arg 2: next player                         */
/*   Summary: Determines the next player.           */
/*                                                  */
/* ************************************************ */
 
other_player(g, b).
other_player(b, g).


/* ************************************************ */
/*                                                  */
/*   print_level_CvsC/2                             */
/*      -Arg 1: difficulty of player 1              */
/*      -Arg 2: difficulty of player 2              */
/*   Summary: Interface for the players difficulty. */
/*                                                  */
/* ************************************************ */
	
print_level_CvsC(Mode1, Mode2):-
        repeat,
        print(' Choose Difficulty '),nl,
        print('1 - Easy'), nl,
        print('2 - Normal'), nl,
        print('3 - Hard'), nl,
        print('Select computer 1''s difficulty: '),
        read(Mode1),
        print('Select computer 2''s difficulty: '),
        read(Mode2),
        integer(Mode1),
        integer(Mode2),
        Mode1 > 0,
        Mode1 < 4,
        Mode2 > 0,
        Mode2 < 4.


/* ************************************************ */
/*                                                  */
/*   print_level_HvsC/2                             */
/*      -Arg 1: difficulty of player 1              */
/*   Summary: Interface for the players difficulty. */
/*                                                  */
/* ************************************************ */
             
print_level_HvsC(Mode):-
        repeat,
        print(' Choose Difficulty '),nl,
        print('1 - Easy'), nl,
        print('2 - Normal'), nl,
        print('3 - Hard'), nl,
        print('Select computer''s difficulty: '),
        read(Mode),
        integer(Mode),
        Mode > 0,
        Mode < 4.


/* ************************************************ */
/*                                                  */
/*   ask_level/{1,2}                                */
/*      -Arg 1: difficulty of player 1              */
/*      -Arg 2: difficulty of player 2              */
/*   Summary: Asks for the players difficulty.      */
/*                                                  */
/* ************************************************ */

ask_level(Depth1, Depth2):-
        print_level_CvsC(Depth1, Depth2).
        
ask_level(Depth):-
        print_level_HvsC(Depth).
        