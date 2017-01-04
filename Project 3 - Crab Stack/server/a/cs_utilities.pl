/* ************************************************ */
/*                                                  */
/*                     Utilities                    */
/*                                                  */
/* ************************************************ */

:- use_module(library(lists)).

pressEnterToContinue:-
	write('Press <Enter> to continue.'), nl,
	waitForEnter, !.


waitForEnter:-
	get_char(_).


clearConsole:-
	clearConsole(40), !.

clearConsole(0).

clearConsole(N):-
	nl,
	N1 is N-1,
	clearConsole(N1).


getChar(Input):-
	get_char(Input),
	get_char(_).

getCode(Input):-
	get_code(TempInput),
	get_code(_),
	Input is TempInput - 48.

getInt(Input):-
	get_code(TempInput),
	Input is TempInput - 48.


discardInputChar:-
	get_code(_).


printlist([]).

printlist([X]):-
       write(X).  

printlist([X|List]) :-
        write(X),write(', '),
        printlist(List). 
	

intersection([], _, []).
intersection([Head|L1tail], L2, L3) :-
        memberchk(Head, L2),
        !,
        L3 = [Head|L3tail],
        intersection(L1tail, L2, L3tail).
intersection([_|L1tail], L2, L3) :-
        intersection(L1tail, L2, L3).


delete_all(X, L, L):-
        \+ member(X, L).
        

delete_all(X, L, L1):-
        member(X, L),
        delete(L, X, L2),
        delete_all(X, L2, L1),!.


delete_all_list([], L, L).

delete_all_list([H|T], L, L2):-
        delete_all(H, L, L3),
        delete_all_list(T, L3, L2),!.