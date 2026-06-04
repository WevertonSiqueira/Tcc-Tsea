import qrcode
import os

codigo = "PECA-00125"

qr = qrcode.make(codigo)

caminho = os.path.abspath("peca00125.png")

qr.save(caminho)

print("Salvo em:", caminho)