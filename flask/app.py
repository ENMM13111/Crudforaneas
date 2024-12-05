
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

def conectar(vhost, vuser, vpass, vdb):
    conn = pymysql.connect(host=vhost, user=vuser, passwd=vpass, db=vdb, charset='utf8mb4')
    return conn

@app.route("/api/clientes", methods=['GET'])
def obtener_clientes():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Clientes")
        clientes = cur.fetchall()
        data = []
        for row in clientes:
            cliente = {'id_cliente': row[0], 'nombre': row[1], 'telefono': row[2], 'direccion': row[3], 'correo': row[4], 'fecha_registro': row[5]}
            data.append(cliente)
        return jsonify({'clientes': data})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar clientes'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/clientes/<int:id_cliente>", methods=['GET'])
def obtener_cliente(id_cliente):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Clientes WHERE id_cliente = %s", (id_cliente,))
        cliente = cur.fetchone()
        if cliente:
            data = {'id_cliente': cliente[0], 'nombre': cliente[1], 'telefono': cliente[2], 'direccion': cliente[3], 'correo': cliente[4], 'fecha_registro': cliente[5]}
            return jsonify({'cliente': data})
        else:
            return jsonify({'mensaje': 'Cliente no encontrado'}), 404

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar el cliente'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/clientes", methods=['POST'])
def crear_cliente():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("INSERT INTO Clientes (nombre, telefono, direccion, correo, fecha_registro) VALUES (%s, %s, %s, %s, %s)",
                    (request.json['nombre'], request.json['telefono'], request.json['direccion'], request.json['correo'], request.json['fecha_registro']))
        conn.commit()
        return jsonify({'mensaje': 'Cliente creado'}), 201
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al crear el cliente'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/clientes/<int:id_cliente>", methods=['PUT'])
def actualizar_cliente(id_cliente):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("UPDATE Clientes SET nombre = %s, telefono = %s, direccion = %s, correo = %s, fecha_registro = %s WHERE id_cliente = %s",
                    (request.json['nombre'], request.json['telefono'], request.json['direccion'], request.json['correo'], request.json['fecha_registro'], id_cliente))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Cliente actualizado'})
        else:
            return jsonify({'mensaje': 'Cliente no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar el cliente'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/clientes/<int:id_cliente>", methods=['DELETE'])
def eliminar_cliente(id_cliente):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("DELETE FROM Clientes WHERE id_cliente = %s", (id_cliente,))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Cliente eliminado'})
        else:
            return jsonify({'mensaje': 'Cliente no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar el cliente'}), 500
    
    finally:
        cur.close()
        conn.close()


@app.route("/api/productos", methods=['GET'])
def obtener_productos():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Productos")
        productos = cur.fetchall()
        data = []
        for row in productos:
            producto = {'id_producto': row[0], 'nombre': row[1], 'descripcion': row[2], 'precio': row[3], 'tipo_producto': row[4]}
            data.append(producto)
        return jsonify({'productos': data})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar productos'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/productos/<int:id_producto>", methods=['GET'])
def obtener_producto(id_producto):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Productos WHERE id_producto = %s", (id_producto,))
        producto = cur.fetchone()
        if producto:
            data = {'id_producto': producto[0], 'nombre': producto[1], 'descripcion': producto[2], 'precio': producto[3], 'tipo_producto': producto[4]}
            return jsonify({'producto': data})
        else:
            return jsonify({'mensaje': 'Producto no encontrado'}), 404

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar el producto'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/productos", methods=['POST'])
def crear_producto():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("INSERT INTO Productos (nombre, descripcion, precio, tipo_producto) VALUES (%s, %s, %s, %s)",
                    (request.json['nombre'], request.json['descripcion'], request.json['precio'], request.json['tipo_producto']))
        conn.commit()
        return jsonify({'mensaje': 'Producto creado'}), 201
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al crear el producto'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/productos/<int:id_producto>", methods=['PUT'])
def actualizar_producto(id_producto):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("UPDATE Productos SET nombre = %s, descripcion = %s, precio = %s, tipo_producto = %s WHERE id_producto = %s",
                    (request.json['nombre'], request.json['descripcion'], request.json['precio'], request.json['tipo_producto'], id_producto))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Producto actualizado'})
        else:
            return jsonify({'mensaje': 'Producto no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar el producto'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/productos/<int:id_producto>", methods=['DELETE'])
def eliminar_producto(id_producto):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("DELETE FROM Productos WHERE id_producto = %s", (id_producto,))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Producto eliminado'})
        else:
            return jsonify({'mensaje': 'Producto no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar el producto'}), 500
    
    finally:
        cur.close()
        conn.close()


@app.route("/api/inventarios", methods=['GET'])
def obtener_inventarios():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Inventario")
        inventarios = cur.fetchall()
        data = []
        for row in inventarios:
            inventario = {'id_inventario': row[0], 'id_producto': row[1], 'cantidad': row[2], 'fecha_ingreso': row[3]}
            data.append(inventario)
        return jsonify({'inventarios': data})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar inventarios'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/inventarios/<int:id_inventario>", methods=['GET'])
def obtener_inventario(id_inventario):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Inventario WHERE id_inventario = %s", (id_inventario,))
        inventario = cur.fetchone()
        if inventario:
            data = {'id_inventario': inventario[0], 'id_producto': inventario[1], 'cantidad': inventario[2], 'fecha_ingreso': inventario[3]}
            return jsonify({'inventario': data})
        else:
            return jsonify({'mensaje': 'Inventario no encontrado'}), 404

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar el inventario'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/inventarios", methods=['POST'])
def crear_inventario():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("INSERT INTO Inventario (id_producto, cantidad, fecha_ingreso) VALUES (%s, %s, %s)",
                    (request.json['id_producto'], request.json['cantidad'], request.json['fecha_ingreso']))
        conn.commit()
        return jsonify({'mensaje': 'Inventario creado'}), 201
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al crear el inventario'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/inventarios/<int:id_inventario>", methods=['PUT'])
def actualizar_inventario(id_inventario):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("UPDATE Inventario SET id_producto = %s, cantidad = %s, fecha_ingreso = %s WHERE id_inventario = %s",
                    (request.json['id_producto'], request.json['cantidad'], request.json['fecha_ingreso'], id_inventario))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Inventario actualizado'})
        else:
            return jsonify({'mensaje': 'Inventario no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar el inventario'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/inventarios/<int:id_inventario>", methods=['DELETE'])
def eliminar_inventario(id_inventario):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("DELETE FROM Inventario WHERE id_inventario = %s", (id_inventario,))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Inventario eliminado'})
        else:
            return jsonify({'mensaje': 'Inventario no encontrado'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar el inventario'}), 500
    
    finally:
        cur.close()
        conn.close()
@app.route("/api/ventas", methods=['GET'])
def obtener_ventas():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Ventas")
        ventas = cur.fetchall()
        data = []
        for row in ventas:
            venta = {
                'id_venta': row[0],
                'id_cliente': row[1],
                'fecha_venta': row[2].strftime('%Y-%m-%d'),
                'total': row[3]
            }
            data.append(venta)
        return jsonify({'ventas': data})
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar ventas'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/ventas/<int:id_venta>", methods=['GET'])
def obtener_venta(id_venta):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("SELECT * FROM Ventas WHERE id_venta = %s", (id_venta,))
        venta = cur.fetchone()
        if venta:
            data = {
                'id_venta': venta[0],
                'id_cliente': venta[1],
                'fecha_venta': venta[2].strftime('%Y-%m-%d'),
                'total': venta[3]
            }
            return jsonify({'venta': data})
        else:
            return jsonify({'mensaje': 'Venta no encontrada'}), 404

    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar la venta'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/ventas", methods=['POST'])
def crear_venta():
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("INSERT INTO Ventas (id_cliente, fecha_venta, total) VALUES (%s, %s, %s)",
                    (request.json['id_cliente'], request.json['fecha_venta'], request.json['total']))
        conn.commit()
        return jsonify({'mensaje': 'Venta creada'}), 201
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al crear la venta'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/ventas/<int:id_venta>", methods=['PUT'])
def actualizar_venta(id_venta):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("UPDATE Ventas SET id_cliente = %s, fecha_venta = %s, total = %s WHERE id_venta = %s",
                    (request.json['id_cliente'], request.json['fecha_venta'], request.json['total'], id_venta))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Venta actualizada'})
        else:
            return jsonify({'mensaje': 'Venta no encontrada'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar la venta'}), 500
    
    finally:
        cur.close()
        conn.close()

@app.route("/api/ventas/<int:id_venta>", methods=['DELETE'])
def eliminar_venta(id_venta):
    try:
        conn = conectar('localhost', 'root', '', 'granjaa')
        cur = conn.cursor()
        cur.execute("DELETE FROM Ventas WHERE id_venta = %s", (id_venta,))
        if cur.rowcount > 0:
            conn.commit()
            return jsonify({'mensaje': 'Venta eliminada'})
        else:
            return jsonify({'mensaje': 'Venta no encontrada'}), 404
    
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar la venta'}), 500
    
    finally:
        cur.close()
        conn.close()




if __name__ == '__main__':
    app.run(debug=True)
