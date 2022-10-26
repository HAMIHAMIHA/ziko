Component({
  properties: {
    lottery: Object,
    type: String,
    _t: Object,
    _offer: Object,
  },

  options: {
    addGlobalClass: true
  },
  attached: function() {
    console.log(this, "lottery header")
  },

  methods: {

  },
})
