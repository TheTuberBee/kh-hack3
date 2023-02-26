## ESPORTSMANAGER 2023 - ELO SYSTEM 

### Team '; DROP TABLE projects; --

Our project tackles the challenge of creating a fair leaderboard for team-based games using the ELO ranking system, while also providing a platform for players to find suitable teammates. The problem with the original ELO system is that it was designed for 1v1 action, chess to be precise. Therefore, it does not account for individual contributions in a team, resulting in an unfair reward and penalty distribution, which will lead to user dissatisfaction.

We imagined a leaderboard that takes different gameplay factors - like kill / death count and looting - into account. However, given that it should be a generalized solution for team-based games, the concept of a game had to be a database model instead of being hard coded logic in the realms of code. That approach has that nice benefit of the staff, or even the community being able to add new games and fine-tune existing boards on the fly. In our system, a game is at minimum a simple vector in our database, where every value - which we call a factor's weight - corresponds to the value of a particular action in the game for the player's team. Matches are stored as the round win ratio of the teams, the composition of the teams, and the stats of the individual players, again, in a vector. The calculated contribution of a player to the team is the linear combination of their stats and the weight vector of the game. After a match, the ELO system's reward or penalty is distributed proportionally to the players' contribution - see the math in `backend/api/elo.py`. 

For this event, we have created a demo using League of Legends data scraped from the Riot Games API. Our service currently uses a Flask backend, React.js frontend, and MongoDB database. 

The teammate recommendation service is purely for LoL players, and is based on our ELO ratings. The choice is aided with tags extracted from a GPT-3 model fine-tuned by us. 

We have developed a proof of concept that demonstrates our ability to upload data for games that lack an API, such as Fifa22 on PS. Currently, the program is limited to retrieving only the two team names and their scores. We achieve this using the Google Vision API to extract text from images, and a custom GPT-3 model to organize the information. Although the results are not entirely reliable at this stage, we believe that with further prompt engineering, the program can become more consistent and accurate.

Regarding the future, the service could see an incredible performance lift with implementing proper caching and using a compiled language like C++ for the ELO algorithm. The user experience would be greatly improved if we have displayed more statistics on the site. Overall, our project has the potential to make a real-world impact on the gaming community by providing a fair and effective ranking system and creating a better gaming experience for all players if we could integrate it with Metaplayers products.

## Try it!

Visit https://kh-hack3.vercel.app.
