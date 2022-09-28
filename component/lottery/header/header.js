Component({
  properties: {
    lottery: Object,
    _t: Object,
  },

  options: {
    addGlobalClass: true
  },
  attached: function() {
    console.log(this.properties)
  },
  methods: {

  }
})
