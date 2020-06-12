# Suggest-it

The project is deployed on Heroku : https://suggest-it.herokuapp.com/

The purpose of this assignment is to create "Suggestion box" website. 

  - Only a registered/logged in user can add suggestions
  - Even if you are not registred you will be able to see the suggestions,but nothing more.
  - You can update your own suggestion or delete it.
  - The user has a profile tab, where can find relevant information for him/her.
  - Most signed posts are sorted out by the number of votes.
  - Clicking on an user takes you on a user profile page.
  - Each post has publisher, title, description and date.
  
Clarifications : You can browse all suggestions from the home page. By clicking on a suggestion it will redirect you to the suggestion page.There you can support a suggestion by "voting/ signing" the suggestion. You can also comment with your own improvement / suggestion on that suggestion. I find the words suggestion/ suggestios/ signatures and similar confusing, because of their close pronounciation and writing.

# Admin Dashboard

  - Admin can Edit / Delete / Hide posts 
  - Note: Hiding feature is commented out as for the moment it will hide all posts for NOT registered users (aka visitors)
  - Dashboard with all posts and users
  - Admin can 

Reminder : create an .env file 
REACT_APP_JWT_SECRET = "something"
REACT_APP_SECRET = "something"


```sh
$ npm run dev
```
