import endpoints

import os
import urllib
import operator



import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote

from operator import itemgetter
from google.appengine.ext import ndb



WEB_CLIENT_ID = '747430920590-h2oneiqur6r83a7dng3rksednppme8es.apps.googleusercontent.com'
ANDROID_CLIENT_ID = 'replace this with your Android client ID'
IOS_CLIENT_ID = 'replace this with your iOS client ID'
ANDROID_AUDIENCE = WEB_CLIENT_ID

package = 'pocket_juke'
#thsi represents the entitiy for a user class

class Party(ndb.Model):
    """Somthoing"""


#NDB data type user
class User(ndb.Model):
    """Sub Model representing the user"""
    user_id = ndb.StringProperty(indexed=True)
    party_key = ndb.KeyProperty(Party,indexed=True)


#NDB data type party
class Party(ndb.Model):
    """main model to represent a party"""
    party_creator = ndb.KeyProperty(User,indexed=True)
    party_name = ndb.StringProperty(indexed=True)
    code = ndb.StringProperty(indexed=False)
    attending = ndb.IntegerProperty(indexed=False)

#NDB datatype for a song
class Song(ndb.Model):
    song_name = ndb.StringProperty()
    track_id = ndb.StringProperty(indexed=True)
    user_suggest = ndb.KeyProperty(indexed=True)
    party_key = ndb.KeyProperty(Party,indexed=True)


#NDB datatype for an activity
class Activity(ndb.Model):
    song = ndb.KeyProperty(Song,indexed=True)
    party_key = ndb.KeyProperty(Party,indexed=True)
    user_vote = ndb.KeyProperty(User,indexed=True)
    time_stamp = ndb.DateTimeProperty(auto_now_add=True)




#this represents the entity for housing the party name and code
class Party_class(messages.Message):
  """Greeting that stores a message."""
  name = messages.StringField(1, required=True)
  pass_code = messages.StringField(2, required=False)
  party_id = messages.StringField(3)
#this represents the entity for housing the Activity_Class

class Activity_class(messages.Message):


    track_id = messages.StringField(1,required=True)

class Song_class(messages.Message):
    song_name = messages.StringField(1,required=True)
    track_id = messages.StringField(2,required=True)

#this holsd the entity that is used for the response for successful/not succesful additcion of a party
class add_response(messages.Message):
    response = messages.StringField(1,required=True)


#this hold the list of parties that will be passed back to the user when the query for a name of a party is successful
class Party_list(messages.Message):
  """Collection of Parties."""
  Parties = messages.MessageField(Party_class,1,repeated=True)


class Party_info(messages.Message):
    Activity_list = messages.MessageField(Activity_class,1,repeated=True)
    Party_key = messages.StringField(2,required=True)




"""Pocket Juke API using Google App Engine Cloud Endpoints"""
@endpoints.api(name='pocketjuke', version='v1',
               allowed_client_ids=[WEB_CLIENT_ID, ANDROID_CLIENT_ID,
                                   IOS_CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID],
               audiences=[ANDROID_AUDIENCE],
               scopes=[endpoints.EMAIL_SCOPE])
class PocketJukeAPI(remote.Service):
  """Pocket Juke API v1."""
  @endpoints.method(Party_class,add_response,
                    path='authed_addParty',http_method='POST',
                    name='pocketjuke.addPartyAuthed')
  def add_Party(self,request):
      party_query = Party.query(Party.party_name == request.name)
      if not party_query.get():
          current_user = endpoints.get_current_user()
          user_query = User.query(User.user_id == current_user.user_id())
          user = user_query.get()

          new_party = Party(party_name = request.name,party_creator = user_query.get(keys_only=True),code = request.pass_code,attending =+1)
          user.party_key = new_party.put()
          user.put()


          return add_response(response='added party')
      else:

          return add_response(response="party already exsists")
  @endpoints.method(message_types.VoidMessage,add_response,
                    path='authed_addUser',http_method="POST",
                    name='pocketjuke.addUserAuthed')
  def add_User(self,request):
      active_user = endpoints.get_current_user()
      user_query = User.query(User.user_id == active_user.user_id())
      if user_query.get():
          return add_response(response = 'User already in the database')
      else:
          new_user = User(user_id = active_user.user_id(),party_key = None)
          new_user.put()
          return add_response(response="user added to the database")
  QUANTITY = endpoints.ResourceContainer(
    Party_class,offset=messages.IntegerField(4, variant=messages.Variant.INT32))
  @endpoints.method(QUANTITY,Party_list,
                    path='authed_getParty',http_method='POST',
                    name='pocketjuke.getPartyAuthed')
  def get_parties(self,request):
      current_user = endpoints.get_current_user()
      keywords = []
      party_list = []
      keywords.append(request.name)
      party_query = Party.query(Party.party_name.IN(keywords))

      if request.offset > 10:
          for party in party_query.fetch(10,offset=request.offset):
              party_list.append(Party_class(name= request.party_name))

          return Party_list(Parties = party_list)

        #if we are only pulling the first ten Parties
      else:

          #need to break the query up into
          for party in party_query.fetch(10):
              party_list.append(Party_class(name= party.party_name))
          return Party_list(Parties = party_list)
  @endpoints.method(message_types.VoidMessage,add_response,
                    path='auted_leaveParty',http_method='POST',
                    name='pocketjuke.leavePartyAuthed')
  def leave_Party(self,request):
      current_user = endpoints.get_current_user()
      active_user = User.query(User.user_id == current_user.user_id())
      user = active_user.get()
      user.party_key = None
      user.put()
      return add_response(response="Removed from the party")

  @endpoints.method(Party_class,add_response,
                    path='authed_joinParty',http_method='POST',
                    name='pocketjuke.joinPartyAuthed')
  def join_Party(self,response):
      current_user = endpoints.get_current_user()
      keywords = []
      keywords.append(response.name)
      party_query = Party.query(Party.party_name.IN(keywords))
      if party_query.get():
          user_query = User.query(User.user_id == current_user.user_id())
          user = user_query.get()
          party = party_query.get()
          party.attending = party.attending + 1
          user.party_key = party.put()
          user.put()
          return add_response(response="Joined party")
      else:
          return add_response(response="Unable to Join Party")
  @endpoints.method(Song_class,add_response,
                    path='authed_addSong',http_method='POST',
                    name='pocketjuke.addSongAuthed')
  def add_song(self,request):
      current_user = endpoints.get_current_user()
      user_query = User.query(User.user_id == current_user.user_id())
      user = user_query.get()
      party_query = user.party_key.get()
      song_query = Song.query(ndb.AND(Song.song_name == request.song_name,Song.party_key == user.party_key))
      if not song_query.get():
          new_song = Song(song_name = request.song_name,track_id = request.track_id, user_suggest = user_query.get(keys_only=True),party_key = user.party_key)
          new_song.put()
          return add_response(response='Added song as a suggestion')
      else:
          new_activity = Activity(song=song_query.get(keys_only=True),party_key=user.party_key,user_vote=user_query.get(keys_only=True))
          new_activity.put()
          return add_response(response='Song already added as suggestion will consider this as a vote')

  @endpoints.method(Song_class,add_response,
                    path='authed_voteSong',http_method="POST",
                    name='pocketjuke.voteSongAuthed')
  def vote_song(self,request):
      current_user = endpoints.get_current_user()
      user_query = User.query(User.user_id == current_user.user_id())
      user = user_query.get()
      song_query = Song.query(ndb.AND(Song.song_name == request.song_name,Song.party_key == user.party_key))
      if song_query.get():

          new_activity = Activity(song=song_query.get(keys_only=True),party_key = user.party_key,user_vote=user_query.get(keys_only=True))
          new_activity.put()
          return add_response(response='Added vote to activity list')
      else:
          return add_response(response = 'Could not added vote to activity list')
  @endpoints.method(message_types.VoidMessage,Party_info,
                    path='authed_partyInfo',http_method="POST",
                    name='pocketjuke.getPartyInfoAuthed')
  def get_PartyInfo(slef,request):
      current_user = endpoints.get_current_user()
      user_query = User.query(User.user_id == current_user.user_id())
      user = user_query.get()
      activity_list = Activity.query(Activity.party_key == user.party_key)
      party_activity_list = []
      for activity in activity_list:
          song = activity.song.get()
          party_activity_list.append(Activity_class(track_id = song.track_id))
      return Party_info(Activity_list = party_activity_list,Party_key= user.party_key.urlsafe())




APPLICATION = endpoints.api_server([PocketJukeAPI])
