# Scrabble

This project is meant to be used to keep track of the scores when playing with family or friends to that famous game called scrabble.

## Home

The Home view serves as an intro to the app, It includes links to:
- Manage users
- Start a new game
- See previous games

## User management

From this page you can add/remove users from the game
Keep in mind that once you remove a user, all their data will disappear.

## Start a new game

First step will be deciding who is playing the game from the list of users that were created.

Second step will show you whose turn is it and you can already start adding words and points.

Once the game is over, click on End game and you will see how many points each player got and who won the game!

## Previous games

It will list all previous games including who took part in them and how many points they got.
You will also be able to delete the games if you don't feel happy about them.

# Actions needed

Users CRUD: TODO edit users
Select users to add them to a game to be created
Start game
    - Checks if there are enough participants
    - Shuffles the participants
    - Announces who starts the game
Register a turn
    - word (optional)
    - score
    - comments
End game
    - announces the winner
    - closes the game so you can start again

