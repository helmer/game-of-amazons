## Game
https://game-of-amazons.vercel.app/

## Background
Some 14 years ago I had a small breakdown in the university. Game Theory, one of the best lectures I ever took, proposed a challenge - implement an AI winning 3 matches out of 5 against the AI written by professor Jan Willemson.
I put a lot of effort into this "intelligence", attempting to apply Minimax parallelized across four 3GHz processors, only to fail 0 vs 5.
I was one of the few failures, most likely because I had no idea what I was doing leading to my dad (who is also a Game Theory boss)
expelling me from the university (last part is only half true).


The game itself is great - https://en.wikipedia.org/wiki/Game_of_the_Amazons.
For example, GOA has 2176 possible moves on turn one, compared to 20 in Chess.
It is still infinitely simpler than Chess, the possibilities reduce exponentially going forward.


The rules are simple - every piece moves like a queen in chess.
Your turn consists of two actions - move queen, shoot arrow (also like a queen).
Where the arrow lands, tile becomes unusable until the end of game. First one to run out of moves loses.


Fast forward this spring, I am applying for a job where they want to test my ReactJS skills.
"No problem, I have done ReactJS for the past 2 years, I can handle this".
I did real bad actually, and as a result wanted to spice up my skills by implementing something in React.
What? Why not the challenge I failed in the university. (One of two actually, the other was "implement a filesystem",
is a bit too much asked from 21 year olds, don't you think University of Tartu cc @jaak.vilo?!)


Anyway, hacked together the game in React, with two difficulty levels - RANDOM and SMART.
Most of my friends cannot beat SMART, but my daughter wins RANDOM about 60% of times. Pretty sure Jan is still better
than SMART. But, what about YOU!
