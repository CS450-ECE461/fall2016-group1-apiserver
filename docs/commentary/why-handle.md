# Why 'handle'?

In the context of [Citizens Band radio (CB) service](https://www.fcc.gov/general/citizens-band-cb-service), 
the word "handle" is a reference to a person's on-the-air pseudonym. Back when
CB radio was licensed prior to the 1970's, the FCC regulated the use of a callsign
to identify a particular user. Many people ignored this regulation (and others),
and used handles to identify themselves while protecting their identity and
avoiding prosecution. The FCC eventually lifted the licensing requirements, but
a culture had already begun around the use of handles.

[Twitter](https://twitter.com) uses the term "handle" to identify a particular,
much in the same way that CB radio user identified themselves. You can reference
a particular user by prefacing their handle by "@". If you are a Twitter user,
you may know that you can change your handle at any time, but keep the same
account. This is because a Twitter handle is not the absolute unique identifier
for an account.

Having said all that, we use the term "handle" for two reasons. Terms like "username"
and "screenname", while conceptually the same, do not make sense in the context of
an organization. The goal is to have a field that is shared by both users and
organizations which could be enforced as unique identifiers. I'm also
admittedly a little OCD, so looking at "username" right next to a database
schema with "firstName" or "lastName" bugs the hell out of me.

###### _--Brian D. Foster_
