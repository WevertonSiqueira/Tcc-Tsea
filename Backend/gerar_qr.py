import qrcode
import os

codigo = "youtube.com"

qr = qrcode.make(codigo)

caminho = os.path.abspath("peca00126.png")

qr.save(caminho)

print("Salvo em:", caminho)