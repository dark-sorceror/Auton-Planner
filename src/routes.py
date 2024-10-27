from flask import Blueprint, jsonify, request, render_template, url_for

bp = Blueprint('bp', __name__)

@bp.route('/')
def index():
    image_url = url_for('static', filename='field.png')
    return render_template('index.html', image_url=image_url)

@bp.route('/get-image-url')
def getImageURL():
    image_url = url_for('static', filename='field.png')
    return jsonify({'image_url': image_url})