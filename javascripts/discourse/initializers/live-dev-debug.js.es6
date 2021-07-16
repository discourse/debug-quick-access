export default {
  name: "live-dev-debug",
  initialize(container) {
    const messageBus = container.lookup("message-bus:main");
    const session = container.lookup("session:main");

    // Observe file changes
    messageBus.subscribe(
      "/file-change",
      (data) => {
        console.log('--------');
        console.log(session.mbLastFileChangeId);
        data.forEach((me) => {
          if (me === "refresh") {
          } else if (me.new_href && me.target) {
            console.log(me);
          }
        });
      },
      session.mbLastFileChangeId
    );
  },
};
