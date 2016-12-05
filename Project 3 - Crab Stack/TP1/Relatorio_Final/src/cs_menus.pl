
/* ************************************************ */
/*                                                  */
/*                     Game Menus                   */
/*                                                  */
/* ************************************************ */
mainMenu:-
	printMainMenu,
	getChar(Input),
	(
		Input = '1' -> gameModeMenu, mainMenu;
		Input = '2' -> helpMenu, mainMenu;
		Input = '3' -> aboutMenu, mainMenu;
		Input = '4';

		nl,
		write('Error: invalid input.'), nl,
		pressEnterToContinue, nl,
		mainMenu
	).

printMainMenu:-
	clearConsole,
	write('================================='), nl,
	write('=     ..:: CRAB STACK ::..      ='), nl,
	write('================================='), nl,
	write('=                               ='), nl,
	write('=   1. Play                     ='), nl,
	write('=   2. How to play              ='), nl,
	write('=   3. About                    ='), nl,
	write('=   4. Exit                     ='), nl,
	write('=                               ='), nl,
	write('================================='), nl,
	write('Choose an option:'), nl.

gameModeMenu:-
	printgameModeMenu,
	getChar(Input),
	(
		Input = '1' -> startPvPGame;
		Input = '2' -> startPvBGame;
		Input = '3' -> startBvBGame;
		Input = '4';

		nl,
		write('Error: invalid input.'), nl,
		pressEnterToContinue, nl,
		gameModeMenu
	).

printgameModeMenu:-
	clearConsole,
	write('================================='), nl,
	write('=      ..:: Game Mode ::..      ='), nl,
	write('================================='), nl,
	write('=                               ='), nl,
	write('=   1. Player vs. Player        ='), nl,
	write('=   2. Player vs. Computer      ='), nl,
	write('=   3. Computer vs. Computer    ='), nl,
	write('=   4. Back                     ='), nl,
	write('=                               ='), nl,
	write('================================='), nl,
	write('Choose an option:'), nl.

startPvPGame:-
	playGamePvP.
startPvBGame:-
	playGamePvB.
startBvBGame:-
	playGameBvB.

helpMenu:-
	clearConsole,
	write('==================================================================='), nl,
	write('=                      ..:: How to play ::..                      ='), nl,
	write('==================================================================='), nl,
	write('=                                                                 ='), nl,
	write('=   Crab Stack is an abstract and familiar game.                  ='), nl,
	write('=                                                                 ='), nl,
	write('=   Objective:                                                    ='), nl,
	write('=     To be the last player who still has a crab that can be      ='), nl,
	write('=     legally moved.                                              ='), nl,
	write('=                                                                 ='), nl,
	write('=   Turn:                                                         ='), nl,
	write('=     In each turn, a player can move one of his crabs on top     ='), nl,
	write('=     of another crab respecting the stack rules.                 ='), nl,
	write('=                                                                 ='), nl,
	write('=   Stack Rules:                                                  ='), nl,
	write('=     > Small crabs only can be moved on top of another small     ='), nl,
	write('=       crab.                                                     ='), nl,
	write('=     > Medium crabs can be moved on top of another medium crab   ='), nl,
	write('=       or small ones.                                            ='), nl,
	write('=                                                   Page 1 of 3   ='), nl,
	write('=                                                                 ='), nl,
	write('==================================================================='), nl,
	pressEnterToContinue, nl,

	clearConsole,
	write('==================================================================='), nl,
	write('=                      ..:: How to play ::..                      ='), nl,
	write('==================================================================='), nl,
	write('=                                                                 ='), nl,
	write('=     > Big crabs can be moved on top of any crab.                ='), nl,
	write('=                                                                 ='), nl,
	write('=   Moves:                                                        ='), nl,
	write('=     >  Small crabs must move 3 rocks.                           ='), nl,
	write('=     >  Medium crabs must move 2 rocks.                          ='), nl,
	write('=     >  Big Crabs must move 1 rock.                              ='), nl,
	write('=                                                                 ='), nl,
	write('=   Wave Rule:                                                    ='), nl,
	write('=     Crabs like to stay in a large group and don\'t like to       ='), nl,
	write('=     separate. When two groups of crabs are separated by a       ='), nl,
	write('=     line of rocks, a wave will wash one of them:                ='), nl,
	write('=         1. The group who occupies less rocks is removed.        ='), nl,
	write('=         2. If they occupy the same number of rocks, the group   ='), nl,
	write('=            with less crabs is removed.                          ='), nl,
	write('=                                                                 ='), nl,
	write('=                                                   Page 2 of 3   ='), nl,
	write('=                                                                 ='), nl,
	write('==================================================================='), nl,
	pressEnterToContinue, nl,
             
        clearConsole,
        write('==================================================================='), nl,
        write('=                      ..:: How to play ::..                      ='), nl,
        write('==================================================================='), nl,
        write('=                                                                 ='), nl,
        write('=         3. If the number of crabs in each group is the same,    ='), nl,
        write('=            the player who separeted the crabs, chose the group  ='), nl,
        write('=            to be removed.                                       ='), nl,
        write('=                                                                 ='), nl,
        write('=   End Game:                                                     ='), nl,
        write('=     >  If all player\'s crabs were removed from the game, the    ='), nl,
        write('=        player loses.                                            ='), nl,
        write('=     >  At the beginning of a player\'s turn, if he cannot move   ='), nl,
        write('=        a crab, the player loses.                                ='), nl,
        write('=     >  If the players moves are repeatdly the same, the game    ='), nl,
        write('=        ends in a tie. The players must play another game.       ='), nl,
        write('=                                                                 ='), nl,
        write('=                                                                 ='), nl,
        write('=                                                                 ='), nl,
        write('=                                                                 ='), nl,
        write('=                                                   Page 3 of 3   ='), nl,
        write('=                                                                 ='), nl,
        write('==================================================================='), nl,
        pressEnterToContinue, nl.

aboutMenu:-
	clearConsole,
	write('================================='), nl,
	write('=        ..:: About ::..        ='), nl,
	write('================================='), nl,
	write('=                               ='), nl,
	write('=   Authors:                    ='), nl,
	write('=    > Inês Caldas              ='), nl,
	write('=    > Maria Teresa Chaves      ='), nl,
	write('=                               ='), nl,
	write('=                               ='), nl,
	write('================================='), nl,
	pressEnterToContinue, nl.
