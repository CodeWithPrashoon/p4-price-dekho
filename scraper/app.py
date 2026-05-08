from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/scrape')
def scrape():
    query = request.args.get('q')

    # 🔥 Sample product data (you can expand this later)
    products = [
        {
            "name": "iPhone 15",
            "price": 75000,
            "site": "Amazon",
            "image": "https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg"
        },
        {
            "name": "iPhone 15",
            "price": 73000,
            "site": "Flipkart",
            "image": "https://rukminim2.flixcart.com/image/850/1000/xif0q/mobile/j/p/2/-original-imagtc6hzv9m9c2g.jpeg"
        },
        {
            "name": "iPhone 15",
            "price": 74500,
            "site": "Croma",
            "image": "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1694676306/Croma%20Assets/Communication/Mobiles/Images/300684_0_wz6bch.png"
        }
    ]

    return jsonify(products)


if __name__ == "__main__":
    app.run(port=8000)