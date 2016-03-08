import os
import urllib
import operator


import endpoints
from operator import itemgetter
from google.appengine.api import users
from google.appengine.ext import ndb

from google.appengine.api import oauth

import webapp2
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

"""
# Description: Controller for mainpage access, ie loging in for the first time
#
# Version update: 0.1 added user control statment to check if user is signed in
#"""

#NDB data type party
class Party_(ndb.Model):
    """main model to represent a party"""
    party_creator = ndb.StringProperty(indexed=True)
    name = ndb.StringProperty(indexed=True)
    code = ndb.StringProperty(indexed=False)
    attending = ndb.IntegerProperty(indexed=False)



#NDB data type user
class User(ndb.Model):
    """Sub Model representing the user"""
    user_id = ndb.StringProperty(indexed=True)
    party_key = ndb.KeyProperty(Party_,indexed=True)



#NDB datatype for a song
class Song(ndb.Model):
    track_id = ndb.StringProperty(indexed=True)
    user_suggest = ndb.KeyProperty(indexed=True)
    party_key = ndb.KeyProperty(Party_,indexed=True)
    played = ndb.BooleanProperty()


#NDB datatype for an activity
class Activity(ndb.Model):
    song = ndb.KeyProperty(Song,indexed=True)
    party_key = ndb.KeyProperty(Party_,indexed=True)
    user_vote = ndb.KeyProperty(User,indexed=True)
    time_stamp = ndb.DateTimeProperty(auto_now_add=True)








class MainPage(webapp2.RequestHandler):
    def get(self):
        #access the user object to see if there is an active user
        user = users.get_current_user()
        if user: #if active user is logged in already then redirect to landing page
            query = User.query(User.user_id == user.user_id())
            if not query.get():
                new_user = User(user_id = user.user_id(),party_key = None)
                new_user.put()
                self.redirect('/landing')
            else:
                self.redirect('/landing')

        else: #else bring up index page and see if the user wishes to login with google or create a new google account
            login_url = users.create_login_url(self.request.uri)
            #
            template_values = {
            'login_url': login_url,
            'create_url': login_url,
            }
            template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/index.html')
            self.response.write(template.render(template_values))

class RedirectPage(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get()
                if active_user.party_key == None:
                    template = JINJA_ENVIRONMENT.get_template('html-templates/redirect.html')
                    logout_url = users.create_logout_url(self.request.uri)

                    self.response.write(template.render())
                else:
                    self.redirect('/party')
            else:
                self.redirect('/')
        else:
            self.redirect('/')
"""
# Description: Landing page controller user chooses between two options of create or joining a party
#
# Version update: 0.1 added user control statment to check if user is signed in
#"""
class Landing(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get()
                if active_user.party_key == None:
                    template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/landing.html')
                    logout_url = users.create_logout_url(self.request.uri)
                    template_values={
                    "logout_url": logout_url,
                    }
                    self.response.write(template.render(template_values))
                else:
                    self.redirect('/party')
            else:
                self.redirect('/')
        else:
            self.redirect('/')
"""
# Description: Create party controller, handles the creation of new parties
#
# Version update: 0.1 added user control statment to check if user is signed in
# version update: 0.2 added post response for when party is created
# version update: 0.3 removed post and migrateed it over to endpoints API
#"""
class CreateParty(webapp2.RequestHandler):
    def get(self):
        """Get response"""
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
            #checks if there is an active user in the DB
                active_user = query.get()
                if active_user.party_key != None: #if the user has already joined a party
                    self.redirect('/party')
                else: #else creates party
                    template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/create_party.html')
                    self.response.write(template.render())
            else:
                self.redirect('/')
        else :
            self.redirect('/')
    def post(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
            #checks if there is an active user in the DB
                active_user = query.get()
                name = self.request.get('party_name')
                new_party = Party_(party_creator = user.user_id(),name=self.request.get('party_name'),code = self.request.get('party_code_1'))

                active_user.party_key = new_party.put()
                active_user.put()
                self.redirect('/party')
            else:
                self.redirect('/')
        else :
            self.redirect('/')
"""
# Description: Join porty Controller, hadles users joining already exsisting parties
#
# Version update: 0.1 added user control statment to check if user is signed in
#"""
class JoinParty(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/join_party.html')
            self.response.write(template.render())
        else:
            self.redirect('/')

    def post(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get();
                party = Party_.query(Party_.name == self.request.get('party_name'))
                if party.get():
                    active_user.party_key = party.get(keys_only=True)
                    active_user.put()
                    self.redirect('/party')
            else:
                self.redirect('/')
        else:
            self.redirect('/')


"""
# Description: Party controller handles the party details ie playlist and current playing song
#
# Version update: 0.1 added user control statment to check if user is signed in
#"""
class Party(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get();
                if active_user.party_key != None:
                    template_values = {
                        "party_name": active_user.party_key.get().name,
                    }
                    template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/party.html')
                    self.response.write(template.render(template_values))
                else:
                    self.redirect('/landing')
            else:
                self.redirect('/')
        else:
            self.redirect('/')
"""
# Description: Platlist controller handles the voting of already suggested music
#
# Version update: 0.1 added user control statment to check if user is signed in
#"""
class Playlist(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            template = JINJA_ENVIRONMENT.get_template('html-templates/mobile/playlist.html')
            self.response.write(template.render())
        else:
            self.redirect('/')

"""
# Description:
#
# Version update:
#"""
class WebMainPage(webapp2.RequestHandler):
    def get(self):
        #access the user object to see if there is an active user
        user = users.get_current_user()
        if user: #if active user is logged in already then redirect to landing page
            query = User.query(User.user_id == user.user_id())
            if not query.get():
                new_user = User(user_id = user.user_id(),party_key = None)
                new_user.put()
                self.redirect('web_landing')
            else:
                self.redirect('web_landing')

        else: #else bring up index page and see if the user wishes to login with google or create a new google account
            login_url = users.create_login_url(self.request.uri)
            #
            template_values = {
            'login_url': login_url,
            'create_url': login_url,
            }
            template = JINJA_ENVIRONMENT.get_template('html-templates/web/web-index.html')
            self.response.write(template.render(template_values))


"""
# Description:
#
# Version update:
#"""
class WebLanding(webapp2.RequestHandler):
    def get(self):

        user = users.get_current_user()
        query = User.query(User.user_id == user.user_id())
        if user:
            if query.get():
                active_user = query.get()
                if active_user.party_key == None:
                    template = JINJA_ENVIRONMENT.get_template('html-templates/web/web-landing.html')
                    logout_url = users.create_logout_url(self.request.uri)
                    template_values={
                    "logout_url": logout_url,
                    }
                    self.response.write(template.render(template_values))
                else:
                    self.redirect('/web_party')
            else:
                self.redirect('/web')
        else:
            self.redirect('/web')
"""
# Description:
#
# Version update:
#"""
class WebCreate(webapp2.RequestHandler):
    def get(self):
        """Get response"""
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
            #checks if there is an active user in the DB
                active_user = query.get()
                if active_user.party_key != None: #if the user has already joined a party
                    self.redirect('/web_party')
                else: #else creates party
                    template = JINJA_ENVIRONMENT.get_template('html-templates/web/web-party_create.html')
                    self.response.write(template.render())
            else:
                self.redirect('/web')
        else :
            self.redirect('/web')
    def post(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
            #checks if there is an active user in the DB
                active_user = query.get()
                name = self.request.get('party_name')
                new_party = Party_(party_creator = user.user_id(),name=self.request.get('party_name'),code = self.request.get('party_code_1'))
                active_user.party_key = new_party.put()
                active_user.put()
                self.redirect('/web_party')
            else:
                self.redirect('/web')
        else :
            self.redirect('/web')
"""
# Description:
#
# Version update:
#"""
class WebJoin(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            template = JINJA_ENVIRONMENT.get_template('html-templates/web/web-join_party.html')
            self.response.write(template.render())
        else:
            self.redirect('/web')

    def post(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get();
                party = Party_.query(Party_.name == self.request.get('party_name'))
                if party.get():
                    active_user.party_key = party.get(keys_only=True)
                    active_user.put()
                    self.redirect('/web_party')
            else:
                self.redirect('/web')
        else:
            self.redirect('/web')

"""
# Description:
#
# Version update:
#"""
class WebParty(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get();
                if active_user.party_key != None:
                    logout_url = users.create_logout_url(self.request.uri)
                    template_values={
                    
                    "party_name": active_user.party_key.get().name,
                    }
                    #self.response.write(template.render(template_values))

                    template = JINJA_ENVIRONMENT.get_template('html-templates/web/web-party_page.html')
                    self.response.write(template.render(template_values))
                else:
                    self.redirect('/web_landing')

            else:
                self.redirect('/web')
        else:
            self.redirect('/web')
"""
# Description:
#
# Version update:
#"""
class LeavePartyWeb(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get()
                active_user.party_key = None
                active_user.put()
                self.redirect('/web_landing')
            else:
                self.redirect('/web')
        else:
            self.redirect('/web')
class LeavePartyMobile(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        if user:
            query = User.query(User.user_id == user.user_id())
            if query.get():
                active_user = query.get()
                active_user.party_key = None
                active_user.put()
                self.redirect('/landing')
            else:
                self.redirect('/')
        else:
            self.redirect('/')


app = webapp2.WSGIApplication([
        ('/', MainPage),
        ('/landing*', Landing),
        ('/create*', CreateParty),
        ('/join*', JoinParty),
        ('/party*', Party),
        ('/playlist*', Playlist),
        ('/web*', WebMainPage),
        ('/web_landing*', WebLanding),
        ('/web_create*', WebCreate),
        ('/web_join*', WebJoin),
        ('/web_party*', WebParty),
        ('/redirect/', RedirectPage),
        ('/leave_web', LeavePartyWeb),
        ('/leave_mobile', LeavePartyMobile),
], debug=True)
