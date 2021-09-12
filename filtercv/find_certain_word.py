# imports
import os
# os.environ['TIKA_SERVER_JAR'] =  os.getcwd() + '/tika-server-1.24.jar'
# print(os.environ['TIKA_SERVER_JAR'])
from tika import parser  # pip install tika (Uses java runtime)
from docx import Document
# import PyPDF2
import re


# Some constants
opening_brackets = ['[', '{', '(']
closing_brackets = [']', '}', ')']
ignore_words = ['ptv', 'ltd', 'mr', 'mrs', 'sr', 'jr',
                'dr', ]  # Ignore dot after any of ignore_words


def is_valid_breaker(lines: list, char_index: int, break_point: int, bracket_locations: list) -> bool:
    '''
    Check if the current dot at location char_index in lines is a valid
    breakpoint to form a sentense.
    '''
    if char_index + 1 < len(lines):

        if lines[char_index + 1] != ' ':
            return False
        if char_index + 2 < len(lines):
            if lines[char_index + 2].islower():
                return False

    words_list = lines[break_point: char_index].split()
    if len(words_list) <= 1:
        return False

    # Check if char_index is inside the bracket while steping backward
    initial_index = char_index
    while lines[char_index] != ' ' and char_index > break_point:
        char_index -= 1
        if char_index in bracket_locations:  # Probably a closing bracket
            char_index = bracket_locations[bracket_locations.index(
                char_index) - 1] - 1

    if char_index == break_point or set(lines[char_index: initial_index]) == set(' '):
        return True

    # Get the word to check if it is a valid
    word = lines[char_index + 1: initial_index]

    if word.lower() in ignore_words:
        return False

    return True


def find_word_in_strings(lines: list, word_to_find: str) -> list:
    '''
    Gives a list of line if word_to_find present in lines
    '''

    lines = ' '.join(lines).replace('\n', '. ')
    sentenses = []
    if not len(lines) or word_to_find.lower() not in lines.lower():
        return sentenses

    bracket_locations = []  # Helps if breaking point inside brackets
    break_point = 0         # Index of the starting of the current sentense
    i = 0
    while i < len(lines):

        # Skip everything within brackets and increase index after closing bracket.
        if lines[i] in opening_brackets:
            starting_bracket_location = i
            no_required_bracket = 1
            opening_bracket_type = lines[i]
            closing_bracket_type = closing_brackets[
                opening_brackets.index(lines[i])]

            while no_required_bracket != 0 and i + 1 < len(lines):
                i += 1
                if opening_bracket_type == lines[i]:
                    no_required_bracket += 1
                elif lines[i] == closing_bracket_type:
                    no_required_bracket -= 1

            bracket_locations += [starting_bracket_location, i]

        # Looking for valid '.' and new_line to break sentenses
        if lines[i] == '.':
            if is_valid_breaker(lines, i, break_point, bracket_locations):
                sentenses.append(lines[break_point: i+1].strip())
                break_point = i+1
        i += 1

    found_in_sentenses = []
    for sentense in sentenses:

        # if re.match(r'\b{}\b'.format(word_to_find.lower()), sentense.lower()):
        if word_to_find.lower() in sentense.lower():
            for word in sentense.lower().split():
                if re.match(r'\b{}\b'.format(word_to_find.lower()), word):
                    found_in_sentenses.append(sentense)

    return found_in_sentenses


def find_in_text(file: str, word_to_find: str) -> list:
    with open(file, 'r') as f:
        lines = f.readlines()
    return find_word_in_strings(lines, word_to_find)


def find_in_docx(file: str, word_to_find: str) -> list:
    doc = Document(file)
    lines = [para.text for para in doc.paragraphs]
    return find_word_in_strings(lines, word_to_find)


def find_in_pdf(file: str, word_to_find: str) -> list:
    '''
        argument: file location, word to find
        returns: list of strings including the found word

    '''
    raw = parser.from_file(file)
    return find_word_in_strings(raw['content'].split(" "), word_to_find)


def find_in_pdfBuffer(file: str, word_to_find: str) -> list:
    '''
        argument: file location, word to find
        returns: list of strings including the found word

    '''
    raw = parser.from_buffer(file)
    return find_word_in_strings(raw['content'].split(" "), word_to_find)
