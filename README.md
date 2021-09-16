# filtercvapp
Filter CV app implemented in Django

## Get started
This django server helps serch tags in pdf files. Tags can be a word or a phrase. If the tag is presnet in a pdf file, it will just removed. It also shows in which line the tag is present in a line.
It is currenty working for pdf file. This is no logic to handle any other type for now.

### Getting Started
Clone this repo and go to the repo directory
  `https://github.com/UjjwalKandel/filtercvapp.git` and  `cd filtercvapp`

Create and activate a virtual environment
  `python3 -m venv env`

Install the requirement
  `pip install -r requirements.txt`


## Update
It uses a tika module to read a pdf file which depends upon jdk. More information [https://www.oracle.com/java/technologies/java-se-glance.html](https://www.oracle.com/java/technologies/java-se-glance.html)
