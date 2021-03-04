const client = global.client;

exports.execute = async () => {
    client.user.setPresence({ activity: { name: "Stark Level MongoDB"}, status: "online" });
};

exports.conf = {
  event: "ready"
};