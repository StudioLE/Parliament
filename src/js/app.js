'use strict'

var nextStep, prevStep, changeStep

$(document).ready(function() {

  var step = 0
  var title = 'State Opening of Parliament'
  var bg = 'img/00-palace-of-westminster.jpg'

  var nodes = [
    {
      id: 'london',
      title: 'London',
      type: 'place'
    },
    {
      id: 'buckingham-palace',
      title: 'Buckingham Palace',
      type: 'place'
    },
    {
      id: 'palace-of-westminster',
      title: 'Palace of Westminster',
      type: 'place'
    },
    {
      id: 'commons-chamber',
      title: 'Commons Chamber',
      type: 'place'
    },
    {
      id: 'lords-chamber',
      title: 'Lords Chamber',
      type: 'place'
    },
    {
      id: 'royal-gallery',
      title: 'Royal Gallery',
      type: 'place'
    },
    {
      id: 'basement',
      title: 'Basement',
      type: 'place'
    },
    {
      id: 'yeomen',
      title: 'Yeomen of the Guard',
      type: 'people'
    },
    {
      id: 'commons',
      title: 'Members of the Commons',
      type: 'people'
    },
    {
      id: 'lords',
      title: 'Members of the Lords',
      type: 'people'
    },
    {
      id: 'hostage',
      title: 'Parliamentary Hostage',
      type: 'people'
    },
    {
      id: 'regalia',
      title: 'Royal Regalia',
      type: 'people'
    },
    {
      id: 'monarch',
      title: 'The Monarch',
      type: 'people'
    },
    {
      id: 'blackrod',
      title: 'Gentleman Usher of the Black Rod',
      type: 'people'
    }
  ]

  var connections = [
    {
      source: 'buckingham-palace',
      target: 'london'
    },
    {
      source: 'palace-of-westminster',
      target: 'london'
    },
    {
      source: 'lords-chamber',
      target: 'palace-of-westminster'
    },
    {
      source: 'commons-chamber',
      target: 'palace-of-westminster'
    },
    {
      source: 'royal-gallery',
      target: 'palace-of-westminster'
    },
    {
      source: 'basement',
      target: 'palace-of-westminster'
    },
    {
      source: 'yeomen',
      target: 'buckingham-palace'
    },
    {
      source: 'commons',
      target: 'palace-of-westminster'
    },
    {
      source: 'lords',
      target: 'palace-of-westminster'
    },
    {
      source: 'hostage',
      target: 'palace-of-westminster'
    },
    {
      source: 'regalia',
      target: 'buckingham-palace'
    },
    {
      source: 'monarch',
      target: 'buckingham-palace'
    },
    {
      source: 'blackrod',
      target: 'palace-of-westminster'
    }
  ]

  // d3 graph example from: https://bl.ocks.org/mbostock/4062045
  // d3 responsive viewport: http://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive
  // Animating changes: http://bl.ocks.org/ericcoopey/6c602d7cb14b25c179a4

  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height")

  var config = {
    nodeRadius: 10,
    linkDistance: 75,
    chargeStrength: -200
  }

  var fillColour = function(d) {
    if(d.type == 'place') {
      return '#FF4136'
    }
    else if(d.type == 'people') {
      return '#0074D9'
    }
    else {
      return '#FFDC00'
    }
  }

  var setup = function() {

    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", 
        d3.forceManyBody()
          .strength(config.chargeStrength)
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    svg.selectAll("*").remove()

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(connections)
      .enter().append("line")


    link.exit().remove()

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")

    node.append("circle")
      .attr("r", config.nodeRadius)
      .attr("fill", fillColour)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )

    node.append("svg:text")
      .text(function(d) { return d.title; })
      .style("fill", "#fff")
      .attr("x", 14)
      .attr("y", ".31em")

    node.exit().remove()

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(connections)
      .distance(config.linkDistance)

    $('#title').html('<span>0' + step + '</span> ' + title)
    
    $('<img src="'+ bg +'">').load(function() {
      $('body').css('background-image', 'url(' + bg + ')')
    })
    

    function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  var changeTarget = function(source, target) {
    var filtered = _.remove(connections, {
      source: {
        id: source
      }
    })
    filtered[0].target = target
    connections.push(filtered[0])
  }

  nextStep = function() {
    step ++
    
    // https://en.wikipedia.org/wiki/State_Opening_of_Parliament
    switch(step) {
      case 1:
        title = 'Searching of the cellars'
        changeTarget('yeomen', 'basement')
        bg = 'img/01-yeomen.jpg'
      break;
      case 2:
        title = 'Assembly of Peers and Commons'
        changeTarget('lords', 'lords-chamber')
        changeTarget('commons', 'commons-chamber')
        bg = 'img/02-commons.jpg'
      break;
      case 3:
        title = 'Delivery of Parliamentary hostage'
        changeTarget('hostage', 'buckingham-palace')
        bg = 'img/03-buckingham-palace.jpg'
      break;
      case 4:
        title = 'Arrival of Royal Regalia'
        changeTarget('regalia', 'royal-gallery')
        bg = 'img/04-regalia.jpg'
      break;
      case 5:
        title = 'Arrival of the Sovereign and assembly of Parliament'
        changeTarget('monarch', 'lords-chamber')
        bg = 'img/05-monarch.jpg'
      break;
      case 6:
        title = 'Royal summons to the Commons'
        changeTarget('blackrod', 'commons-chamber')
        bg = 'img/06-blackrod.jpg'
      break;
      case 7:
        title = 'Procession of the Commons'
        changeTarget('commons', 'lords-chamber')
        changeTarget('blackrod', 'lords-chamber')
        bg = 'img/07-procession.jpg'
      break;
      case 8:
        title = 'Delivery of the speech'
        bg = 'img/08-speech.jpg'
        // changeTarget('yeomen', 'basement')
      break;
      case 9:
        title = 'Departure of monarch'
        changeTarget('monarch', 'buckingham-palace')
        changeTarget('commons', 'commons-chamber')
        bg = 'img/09-departure.jpg'
      break;
      default:
        location.reload()
      break;
    }

    setup()

  }

  // Call setup for the first time
  setup()


})