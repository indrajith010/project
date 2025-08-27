
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from firebase_admin_init import db
# import uuid
# import datetime

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# customers_collection = db.collection("customers")

# # ➕ Add new customer
# @app.route("/customers", methods=["POST"])
# def add_customer():
#     try:
#         data = request.get_json()
#         customer_id = uuid.uuid4().hex
#         customer_data = {
#             "id": customer_id,
#             "name": data.get("name"),
#             "email": data.get("email"),
#             "phone": data.get("phone"),
#             "createdAt": datetime.datetime.now()
#         }
#         customers_collection.document(customer_id).set(customer_data)
#         return jsonify({"message": "Customer added", "customer": customer_data}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# # 📋 Get all customers
# @app.route("/customers", methods=["GET"])
# def get_customers():
#     try:
#         docs = customers_collection.stream()
#         customers = [doc.to_dict() for doc in docs]
#         return jsonify(customers), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# # ❌ Delete customer
# @app.route("/customers/<id>", methods=["DELETE"])
# def delete_customer(id):
#     try:
#         customers_collection.document(id).delete()
#         return jsonify({"message": "Customer deleted"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)

# -----------------------------------------------------------------


from flask import Flask, jsonify, request
from flask_cors import CORS
from firebase_admin_init import db
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def _to_iso(dt):
    try:
        return dt.isoformat() if dt else None
    except Exception:
        try:
            return dt.ToDatetime().isoformat() if dt else None
        except Exception:
            return None

def serialize(doc_id, data):
    return {
        "id": doc_id,
        "name": data.get("name", ""),
        "email": data.get("email", ""),
        "phone": data.get("phone", ""),
        "createdAt": _to_iso(data.get("createdAt")),
        "updatedAt": _to_iso(data.get("updatedAt")),
    }

# GET /customers
@app.get("/customers")
def list_customers():
    docs = db.collection("customers").order_by("createdAt").stream()
    return jsonify([serialize(d.id, d.to_dict()) for d in docs]), 200

# POST /customers
@app.post("/customers")
def create_customer():
    data = request.get_json() or {}
    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "name and email required"}), 400

    cid = uuid.uuid4().hex
    payload = {
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
    db.collection("customers").document(cid).set(payload)
    return jsonify(serialize(cid, payload)), 201

# PUT /customers/<id>
@app.put("/customers/<cid>")
def update_customer(cid):
    ref = db.collection("customers").document(cid)
    snap = ref.get()
    if not snap.exists:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json() or {}
    patch = {
        "name": data.get("name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "updatedAt": datetime.utcnow(),
    }
    patch = {k: v for k, v in patch.items() if v is not None}
    ref.update(patch)
    return jsonify(serialize(cid, ref.get().to_dict())), 200

# DELETE /customers/<id>
@app.delete("/customers/<cid>")
def delete_customer(cid):
    ref = db.collection("customers").document(cid)
    if not ref.get().exists:
        return jsonify({"error": "Customer not found"}), 404
    ref.delete()
    return jsonify({"ok": True}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
