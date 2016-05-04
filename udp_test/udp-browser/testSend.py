import optparse
from pythonosc import osc_message_builder
from pythonosc import udp_client

client = udp_client.UDPClient("127.0.0.1", 7400)
print(client)

m = osc_message_builder.OscMessageBuilder(address = "/test")
m.add_arg(44)
m.add_arg(11)
m = m.build()
client.send(m)
