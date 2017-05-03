function Panel(options) {
	this.id = options.id;
  this.before = options.before;
  this.after = options.after;
  this.showCondition = options.showCondition;
}

function Multipanel(panels, options) {
	this.panels = panels;
  this.beforeAll = options.beforeAll;
  this.afterAll = options.afterAll;
  this.actionIfNoShowablePanels = options.actionIfNoShowablePanels;
  this.currentPanel = null;
}

Multipanel.prototype.start = function() {
  if (this.noShowablePanels()) {
      return actionIfNoShowablePanels();
  }
	this.beforeAll();
  this.panels.forEach(function(panel) {
    $('#'+ panel.id).hide();
  });
  this.changeCurrentPanel(this.firstShowablePanel());
}

Multipanel.prototype.firstShowablePanel = function() {
    return (this.panels[0].showCondition) ? this.panels[0] : this.getNextPanel();
}

Multipanel.prototype.noShowablePanels = function () {
    return _.every(this.panels, function(panel) {
        return !panel.showCondition();
    });
};

Multipanel.prototype.changeCurrentPanel = function(panel) {
	if (this.currentPanel != null) {
  	this.currentPanel.after();
    $('#'+this.currentPanel.id).hide();
  }

  this.currentPanel = this.panels[_.findIndex(this.panels, panel)];
  this.currentPanel.before();
  $('#'+this.currentPanel.id).show();
}

Multipanel.prototype.getCurrentPanelIndex = function() {
	return _.findIndex(this.panels, this.currentPanel)
}
Multipanel.prototype.nextPanel = function() {
  if (this.getNextPanel() != this.currentPanel) {
      this.changeCurrentPanel(this.getNextPanel());
  } else {
    //Don't do anything.
  }
}

Multipanel.prototype.previousPanel = function() {
  if (this.getPreviousPanel() != this.currentPanel) {
      this.changeCurrentPanel(this.getPreviousPanel());
  } else {
    //Don't do anything.
  }
}

Multipanel.prototype.getNextPanel = function() {
  var index = this.getCurrentPanelIndex()
	if (index === (this.panels.length -1)){
  	return this.currentPanel;
  } else {
    var nextPanelIndex = _.findIndex(this.panels, function(panel) {
      return panel.showCondition
    }, index + 1); 
    return this.panels[nextPanelIndex];
  }
}

Multipanel.prototype.getPreviousPanel = function() {
  var index = this.getCurrentPanelIndex()
  if (index === 0){
    return this.currentPanel;
  } else {
    var previousPanelIndex = _.findLastIndex(this.panels, function(panel) {
      return panel.showCondition
    }, index - 1); 
    return this.panels[previousPanelIndex];
  }
}