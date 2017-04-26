from flask import (Flask, render_template, redirect,
                    url_for, request, make_response)
import random
import os
import json
from brewing_tools import BeerXMLParser

app = Flask(__name__)
# Object brewing_tools for setting our xml data
recipe_data = BeerXMLParser()
FPATH = os.getcwd() +'//recipes//'
# default value for recipe name
recipe_name = {'recipe':"no recipe"}

# cache buster
def new_url():
    query = random.randint(100000000, 999999999)
    return '?q={}'.format(query)


def get_xml(name):
    try:
        #!!! all of the things should come in one lump from brewing_tools
        path = FPATH + name + ".xml"
        recipe_data.set_XML(path)
        all_data = recipe_data.get_all_steps()
        recipe = recipe_data.get_recipe_name()
        all_data['recipe_name'] = recipe
        boil_time = recipe_data.get_boil_time()
        all_data['boil_time'] = boil_time
        batch_volume = recipe_data.get_batch_volume()
        all_data['volume'] = batch_volume
        og = recipe_data.get_og()
        all_data['og'] = og
        abv = recipe_data.get_abv()
        all_data['abv'] = abv


    except IOError:
        all_data = {}

    return all_data


@app.route('/')
def index():
    query = new_url()
    extension = {'query':query}
    data = get_xml(recipe_name['recipe'])

    return render_template('index.html', data=data, **extension)


@app.route('/set')
def set():
    query = new_url()
    return render_template('set.html', query=query)


@app.route('/timer')
def timer():
    query = new_url()
    data = get_xml(recipe_name['recipe'])
    extension = {'query':query, 'data':data}
    return render_template('timer.html', **extension)


@app.route('/recipes')
def load_recipes():
    query = new_url()
    all_files = os.listdir(FPATH)
    recipes = []
    # we only populate .xml files
    for recipe in all_files:
        if recipe.split('.')[-1] == 'xml':
            name = '.'.join(recipe.split('.')[:-1])
            recipes.append(name)
    return render_template('recipes.html', recipes=recipes, query=query)


@app.route('/saverecipe', methods=['POST'])
def saverecipe():
    response = make_response(redirect(url_for('timer')))
    # we make this global so it is accesible in index function
    global recipe_name
    # key is 'recipe'
    recipe_name = dict(request.form.items())
    return response






if __name__ == "__main__":
    app.run(debug=True, port=8000, host='0.0.0.0')
