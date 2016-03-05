
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
