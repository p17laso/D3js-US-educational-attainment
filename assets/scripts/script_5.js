var margin = { top: 50, right: 20, bottom: 30, left: 40 },
       width = 960 - margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1, 1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".0"));
    //.tickFormat(formatPercent);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
          return "<strong>Percentage:</strong> <span style='color:red'>" + d.Percentage + "<br/></span><span>Total:</strong> <span style='color:red'>" + d.total + "</span>";
      })

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var data = [{ "name": "Ροδόπης", "total": 31160 },
                 { "name": "Δράμας", "total": 27811 },
                 { "name": "Έβρου", "total": 30685 },
                 { "name": "Θάσου", "total": 2682 },
                 { "name": "Καβάλας", "total": 15037 },
                 { "name": "Ξάνθης", "total": 46432 },
                 { "name": "Θεσσαλονίκη", "total": 188055 },
                 { "name": "Ημαθία", "total": 22627 },
                 { "name": "Πέλλα", "total": 64280 },
                 { "name": "Πιερία", "total": 44791 }];

    var grandTotal = 0;
    data.forEach(function (d) {
        grandTotal += d.total;
    });

    data.forEach(function (d) {
        d['Percentage'] = parseFloat(((d.total / grandTotal) * 100).toFixed(2));
    });

    x.domain(data.map(function (d) { return d.name; }));
    y.domain([0, d3.max(data, function (d) { return d.Percentage; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percentage");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.Percentage); })
        .attr("height", function (d) { return height - y(d.Percentage); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    d3.select("input").on("change", change);

    var xAxisDefault = x.domain(data
               .map(function (d) { return d.name; }))
               .copy();
    function change() {
        var x0;
        if (this.checked) {
            x0 = x.domain(data.sort(this.checked
                ? function (a, b) { return b.Percentage - a.Percentage; }
                : function (a, b) { return d3.ascending(a.name, b.name); })
                .map(function (d) { return d.name; }))
                .copy();
        } else {
            x0 = xAxisDefault;
        }
        svg.selectAll(".bar")
            .sort(function (a, b) { return x0(a.name) - x0(b.name); });

        var transition = svg.transition().duration(750),
            delay = function (d, i) { return i * 50; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d, i) {
                return x0(d.name);
            });

        transition.select(".x.axis")
            .call(xAxis)
          .selectAll("g")
            .delay(delay);
    }
