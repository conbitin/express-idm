ko.applyBindings(new AppViewModel())
function AppViewModel() {
    var selt = this;
    self.input = ko.observable("");
    self.ids = ko.observableArray([]);
    self.url = "http://localhost:3000/memsearch/rest/v1/verify/ids/"

    self.verifyUser = function(data) {
        $.ajax(self.url, {
            type: "post", contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
                console.log(data);
                self.ids([]);
                for (i in data.ids) {
                    self.ids.push(data.ids[i]);
                }
            }
        });
    };

    self.makeIds = ko.computed(function() {
      strInput = self.input().toLowerCase();        
      var arrayOfStr = strInput.split(/[^a-z0-9._-]/);
      var jsonData = {"ids":[]};
      for (i = 0; i < arrayOfStr.length; i++) {
        if (arrayOfStr[i].length >=4 && arrayOfStr[i].length <= 49 && 
            arrayOfStr[i] != 'samsung.com' && jsonData.ids.indexOf(arrayOfStr[i]) == -1) {
            jsonData.ids.push(arrayOfStr[i]);
        }
      }
      self.verifyUser(jsonData);
    });

    self.email = ko.computed(function() {
      if (self.ids().length == 0)
        return "";
      strInput = self.ids().toString();
      result = strInput.replace(/,/g, "@samsung.com; ");
      result += "@samsung.com";
      return result;
    });

    self.numberMem = ko.computed(function() {
      if (self.ids().length == 0)
        return "Chat";
      arrayOfMem = self.ids().toString().split(",");
      return "Chat(" + arrayOfMem.length + ")";
    });

    self.showAlert = function() {
      if (self.ids().length == 0) {
        alert("There is no Id. Please input at least one. ^^");
        return false;
      }
      return true;
    };

    self.chatGroupLink = ko.computed(function() {
      if (self.ids().length == 0)
        return "";
      arrayOfMem = self.ids().toString().split(",");
      result = "mysingleim://";
      for (i = 0; i < arrayOfMem.length; i++) {
          result += arrayOfMem[i];
          if (i < arrayOfMem.length - 1)
            result += ";";
      }
      return result;
    });

}