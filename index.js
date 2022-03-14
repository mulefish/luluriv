demo = {};

demo.TreemapCSS3d = function() {

    "use strict";

    var _width          = 500,
        _height         = 500,
        _renderer       = null,
        _controls       = null,
        _scene          = new THREE.Scene(),
        _camera         = new THREE.PerspectiveCamera(45, _width/_height , 1, 10000),
        _zmetric        = "size",
        _colorScale     = d3.scale.category20c(),
        _zscaleSize     = d3.scale.linear().range([0,500]),
        _zscaleCost     = d3.scale.linear().range([0,500]),
        _buttonBarDiv   = null,
        _elements       = null;

    function TreemapCSS3d(selection) {
        _camera.setLens(100);
        _camera.position.set(-500, -3000, 4000);
        
        _renderer = new THREE.CSS3DRenderer();
        _renderer.setSize(_width, _height);
        _renderer.domElement.style.position = 'absolute';
        _renderer.domElement.style.top = '20px';
        
        selection.node().appendChild(_renderer.domElement);

        _buttonBarDiv = selection.append("div")
            .attr("class", "controls");
        _buttonBarDiv.append("button")
            .text("ZScale: 0")
            .on("click", function() {
                _zmetric = "base";
                transform();
            });
        _buttonBarDiv.append("button")
            .text("ZScale: Size")
            .on("click", function() {
                _zmetric = "size";
                transform();
            });
        _buttonBarDiv.append("button")
            .text("ZScale: Cost")
            .on("click", function() {
                _zmetric = "cost";
                transform();
            });
      
        function position() {
            this.style("width",  function(d) { return Math.max(0, d.dx) + "px"; })
                .style("height", function(d) { return Math.max(0, d.dy) + "px"; });
        }
        
        function enterHandler(d) {
            d3.select(this).append("div")
                .style("font-size", function(d) {
                    return Math.max(18, 0.18*Math.sqrt(d.area))+'px';  // compute font size based on sqrt(area)
                })
                .text(function(d) { 
                    return d.children ? null : d.name; 
                });
            var object = new THREE.CSS3DObject(this);
            object.position.x = d.x + (d.dx / 2);
            object.position.y = d.y + (d.dy / 2);
            object.position.z = 0;
            d.object = object;
            _scene.add(object);
        }
        
      
        function updateHandler(d) {
            var object = d.object;
            var duration = 1000;
            var zvalue = (_zmetric === "size" ? _zscaleSize(d.size) : (_zmetric === "cost" ? _zscaleCost(d.cost) : 50));
          
            d3.select(this).call(position).style("background-color", function(d) {
                return d.name == 'tree' ? '#fff' : _colorScale(d.name); 
            });
          
            var newMetrics = {
                x: d.x + (d.dx / 2) - _width / 2,
                y: d.y + (d.dy / 2) - _height / 2,
                z: zvalue/2
            };

            var coords = new TWEEN.Tween(object.position)
                .to({x: newMetrics.x, y: newMetrics.y, z: newMetrics.z}, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();
          
            var update = new TWEEN.Tween(this)
                .to({}, duration)
                .onUpdate(_.bind(render, this))
                .start();
        }
      
        
        function exitHandler(d) {
            _scene.remove(d.object);
            this.remove();
        }
        
      
        function transform() {
            TWEEN.removeAll();
            _elements.each(updateHandler);
        }
        
      
        function render() {
            _renderer.render(_scene, _camera);
        }
        
        
        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            _controls.update();
        }
   
            
        TreemapCSS3d.load = function(data) {
            _zscaleSize.domain(d3.extent(data.children, function(d) { return d.size;}));
            _zscaleCost.domain(d3.extent(data.children, function(d) { return d.cost;}));

            var color = d3.scale.category20c();

            var treemap = d3.layout.treemap()
                .size([_width, _height])
                .sticky(true)
                .value(function(d) { 
                    return d.size; 
                });

            _elements = selection.datum(data).selectAll(".node")
                .data(treemap.nodes);
          
            _elements.enter()
                .append("div")
                .attr("class", "node")
                .each(enterHandler);

            _elements.each(updateHandler);

            _elements.exit().each(exitHandler).remove();
          
            render();
            animate();
            transform();
        };
        
        //_controls = new THREE.OrbitControls(_camera, _renderer.domElement);
        _controls = new THREE.TrackballControls(_camera, _renderer.domElement);
        _controls.staticMoving  = true;
        _controls.minDistance = 100;
        _controls.maxDistance = 6000;
        _controls.rotateSpeed = 1.5;
        _controls.zoomSpeed = 1.5;
        _controls.panSpeed = 0.5;
        _controls.addEventListener('change', render);
    }

    return TreemapCSS3d;
};

var demoData = {
"name": "tree",
"children": [
{"id":0,"name":"Callum Spencer","size":176,"cost":35},
        {"id":1,"name":"Paul Davidson","size":15,"cost":120},
        {"id":2,"name":"Chris George","size":187,"cost":4},
        {"id":3,"name":"Dawn Vargas","size":170,"cost":156},
        {"id":4,"name":"Veronica Collins","size":134,"cost":168},
        {"id":5,"name":"Drew Wall","size":26,"cost":91},
        {"id":6,"name":"Darren McCall","size":55,"cost":59},
        {"id":7,"name":"Stan Hale","size":95,"cost":139},
        {"id":8,"name":"Cyril Lucero","size":148,"cost":132},
        {"id":9,"name":"Santiago Larsen","size":197,"cost":40},
        {"id":10,"name":"Jay Mathis","size":30,"cost":121},
        {"id":11,"name":"Rebecca Hanna","size":26,"cost":151},
        {"id":12,"name":"Gregory O'Connor","size":11,"cost":199},
        {"id":13,"name":"Jennifer Bond","size":109,"cost":44},
        {"id":14,"name":"Dimitri Valencia","size":97,"cost":32},
        {"id":15,"name":"Jasper Ellison","size":162,"cost":105},
        {"id":16,"name":"Zac Mayer","size":27,"cost":3},
        {"id":17,"name":"Jerry Huang","size":198,"cost":26},
        {"id":18,"name":"Yuri Cummings","size":160,"cost":179},
        {"id":19,"name":"Larissa Burgess","size":83,"cost":96},
        {"id":20,"name":"Graeme Lin","size":11,"cost":199},
        {"id":21,"name":"Elizabeth George","size":78,"cost":157},
        {"id":22,"name":"Phil Abbott","size":137,"cost":165},
        {"id":23,"name":"Christy Daniel","size":18,"cost":149},
        {"id":24,"name":"Ewan Vaughan","size":145,"cost":171},
        {"id":25,"name":"Enrico Calderon","size":189,"cost":85},
        {"id":26,"name":"Lincoln Knox","size":146,"cost":8},
        {"id":27,"name":"Jocelyn Poole","size":117,"cost":15},
        {"id":28,"name":"Amy Valencia","size":115,"cost":105},
        {"id":29,"name":"Leah Mora","size":105,"cost":184},
        {"id":30,"name":"Dietrich Campos","size":17,"cost":16},
        {"id":31,"name":"Collin Anthony","size":143,"cost":157},
        {"id":32,"name":"Keith Erickson","size":108,"cost":142},
        {"id":33,"name":"Elsa Doyle","size":86,"cost":167},
        {"id":34,"name":"Nicola Rojas","size":164,"cost":49},
        {"id":35,"name":"Ilya Beard","size":137,"cost":199},
        {"id":36,"name":"Olivia Goff","size":63,"cost":30},
        {"id":37,"name":"Ewan Vang","size":76,"cost":182},
        {"id":38,"name":"Mia Esparza","size":196,"cost":182},
        {"id":39,"name":"Stephen Conrad","size":24,"cost":94},
        {"id":40,"name":"Fernando Baker","size":19,"cost":67},
        {"id":41,"name":"Magnus Calderon","size":45,"cost":139},
        {"id":42,"name":"Felix Larson","size":46,"cost":51},
        {"id":43,"name":"Kris Flynn","size":22,"cost":132},
        {"id":44,"name":"Sheila Foster","size":173,"cost":185},
        {"id":45,"name":"Tyler Hanna","size":165,"cost":47},
        {"id":46,"name":"Gertwin Brandt","size":125,"cost":41},
        {"id":47,"name":"Brian Newton","size":31,"cost":119},
        {"id":48,"name":"Kayleigh Kelley","size":36,"cost":97},
        {"id":49,"name":"Connor Carson","size":6,"cost":69},
        {"id":50,"name":"Jay Russo","size":164,"cost":49},
        {"id":51,"name":"Lukas Skinner","size":44,"cost":163},
        {"id":52,"name":"Isobel Sweeney","size":140,"cost":165},
        {"id":53,"name":"Braxton Hoover","size":52,"cost":83},
        {"id":54,"name":"Hal Weiss","size":119,"cost":95},
        {"id":55,"name":"Gilbert Le","size":16,"cost":159},
        {"id":56,"name":"Anton Berger","size":60,"cost":155},
        {"id":57,"name":"Giuseppe Dotson","size":33,"cost":11},
        {"id":58,"name":"Jeff Rios","size":79,"cost":112},
        {"id":59,"name":"Sabrina Rowland","size":35,"cost":73},
        {"id":60,"name":"Augusto Buckley","size":124,"cost":80},
        {"id":61,"name":"Craig Finley","size":132,"cost":99},
        {"id":62,"name":"Irene Cantu","size":103,"cost":119},
        {"id":63,"name":"Olga Bowman","size":27,"cost":82},
        {"id":64,"name":"Andy Prince","size":8,"cost":130},
        {"id":65,"name":"Daria Ferrell","size":183,"cost":161},
        {"id":66,"name":"Simon Wu","size":199,"cost":26},
        {"id":67,"name":"Cory Johnston","size":174,"cost":37},
        {"id":68,"name":"Alison Hardin","size":162,"cost":72},
        {"id":69,"name":"Stefan Delgado","size":8,"cost":117},
        {"id":70,"name":"Bram Wang","size":78,"cost":61},
        {"id":71,"name":"Agatha Goodman","size":38,"cost":139},
        {"id":72,"name":"Stefan Ross","size":194,"cost":149},
        {"id":73,"name":"Christian Salinas","size":91,"cost":91},
        {"id":74,"name":"Hart Hurst","size":42,"cost":150},
        {"id":75,"name":"Gabrielle Gould","size":36,"cost":69},
        {"id":76,"name":"Sébastien Randall","size":180,"cost":26},
        {"id":77,"name":"Gwen English","size":72,"cost":93},
        {"id":78,"name":"Daryl Spencer","size":132,"cost":102},
        {"id":79,"name":"Darren Villarreal","size":84,"cost":95},
        {"id":80,"name":"Chris Bowman","size":38,"cost":91},
        {"id":81,"name":"Ignacio Flores","size":200,"cost":13},
        {"id":82,"name":"Rainer Hahn","size":115,"cost":151},
        {"id":83,"name":"Summer Bray","size":37,"cost":193},
        {"id":84,"name":"Hugh Levy","size":110,"cost":105},
        {"id":85,"name":"Dougal Boyle","size":131,"cost":35},
        {"id":86,"name":"Gerard Cox","size":83,"cost":21},
        {"id":87,"name":"Kelly Orozco","size":71,"cost":188},
        {"id":88,"name":"Erin McDaniel","size":119,"cost":69},
        {"id":89,"name":"Wayne Miles","size":24,"cost":41},
        {"id":90,"name":"Jamie Baldwin","size":84,"cost":46},
        {"id":91,"name":"Rene Leonard","size":196,"cost":151},
        {"id":92,"name":"Barbara Powell","size":79,"cost":38},
        {"id":93,"name":"Lawrence Todd","size":86,"cost":146},
        {"id":94,"name":"Sean Neal","size":88,"cost":62},
        {"id":95,"name":"Jake Hoover","size":73,"cost":70},
        {"id":96,"name":"Darren Houston","size":126,"cost":59},
        {"id":97,"name":"Lukas Walker","size":77,"cost":90},
        {"id":98,"name":"Nikolay Miller","size":38,"cost":14},
        {"id":99,"name":"Marc Hancock","size":50,"cost":136}
]
}

    var treemapCSS3d = demo.TreemapCSS3d();
 d3.select("#container_fekofu").append("div")
     .style("position", "relative")
     .call(treemapCSS3d);
    treemapCSS3d.load(demoData);

    window.addEventListener("resize", function() {
        var newWidth  = window.innerWidth,
            newHeight = window.innerHeight;
        _renderer.setSize(newWidth, newHeight);
        _camera.aspect = newWidth / newHeight;
        _camera.updateProjectionMatrix();
    });
