import { showLoading } from "../../../utils/common";

Component({
  properties: {
    _t: Object,
  },

  options: {
    addGlobalClass: true
  },

  methods: {
    show: function() {
      this.selectComponent('#modal_template').showModal();
    },
    close: function() {
      this.selectComponent('#modal_template').closeModal();
    }
  }
})
