# Trello Story Board 'https://trello.com/b/kJWFymbe/missile-command'

# Game Proposal

		*Missle Meeseeks*

		Landing Page
		-Large header displaying title of game
		-Large 'PLAY' button centered on page to link to game page
		-Animated background
		-Clean styles and clear direction for player
		
		Game Page
		-Game created using cnavas element for animations
		-Player introduced to story of game through scrolling text at bottom of the screen.
		-Player is directed to Mission Updates on dashboard for further instructions on game.
		-Dashboard displays Mission Updates(start a round/how many bases remain/end of game message), 'Flurbos' scoreboard that updates continuously, and a Round indicator.


# Project Goals
 My goal with this project is to learn how to incorporate a smaller, playable area on the webpage using canvas. I intend to use canvas only on the interactive area of the game page, while using vanilla JS DOM manipulation to build and structure the rest of the game page dashboard. Directly under the canvas element, I will build a text area with a scrolling 'story' to further engage the player, and provide feedback on performance to declare a win or loss. 
 Once I have a functioning desktop based game, I hope to use a media query to restucture the viewport to be mainly occupied by the canvas, and include a compressed dashboard to the right or directly under the canvas while removing the textScroll to provide more playable room. I also plan to build a touch-based event listener for mobile devices.

 During the creation of this game, I was struggling to use vanilla JS to manipulate arrays and objects in the canvas, so I opted to link to a JQuery CDN in order to create a smoother flow in the code, and to ensure it was working properly. 

 I also came across a large blocker for several days, where the background image I was using would not allow the canvas refresh to remove prior animations, ending in a very crowded screen that was unplayable. To combat this, I chose to overlay the background image with an almost completely opaque 'Night Sky' color, which allows the canvas to refresh the background to remove prior animations. There is a very faint 'ghost' of animations that still remains, which will require me to do more research into how images can be used in the canvas background. 

  My biggest challeneg moving forward is developing media querys to style the page correctly for mobile devices