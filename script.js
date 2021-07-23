const RandomHSLColor = function (hue)
{
    if (hue === undefined) {
        hue = Math.round(Math.random() * 255);
    }

    let sat = Math.round(Math.random() * 80) + 20;
    let light = Math.round(Math.random() * 80) + 20;
    let alpha = Math.random() + 0.3;
    while (alpha > 1) {
        alpha = Math.random() + 0.3;
    }

    
    return `hsla(${hue}deg, ${sat}%, ${light}%, ${alpha})`;
};

const ShapeData = {
    name: document.getElementById('shape-name'),
    width: document.getElementById('shape-width'),
    height: document.getElementById('shape-height'),
    radius: document.getElementById('shape-radius'),
    area: document.getElementById('shape-area'),
    perimeter: document.getElementById('shape-perimeter'),
};
const ShapeContainer = document.getElementById('shapes');

let Shapes = [];


class Shape
{
    constructor(className, width, height, radius, area, perimeter, hue, borderOnly, borderBottomColor, borderTopColor, borderLeftColor, borderRightColor)
    {

        if (width > 600) width = 600;
        if (height > 600) height = 600;

        //Asign the variables
        this.name = className;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.area = area;
        this.perimeter = perimeter;
        this.color = RandomHSLColor(hue);
        this.boderOnly = borderOnly;

        //Set up the html
        this.html = document.createElement('div');
        this.html.className = className + " shape"

        //Border-only shapes are messed up by having the size set
        if (!borderOnly)
        {
            this.html.style.width = width + "px";
            this.html.style.height = height + "px";
        }

        //Coloring - also complicated when using border-only shapes
        if (this.boderOnly)
        {
            if (borderBottomColor) this.html.style.borderBottomColor = this.color;
            if (borderLeftColor) this.html.style.borderLeftColor = this.color;
            if (borderRightColor) this.html.style.borderRightColor = this.color;
            if (borderTopColor) this.html.style.borderTopColor = this.color;

            this.html.style.borderBottomWidth = this.width + "px";
            this.html.style.borderLeftWidth = this.height + "px";
            this.html.style.borderRightWidth = this.height + "px";
            this.html.style.borderTopWidth = this.width + "px";
        } else
        {
            this.html.style.backgroundColor = this.color;
        }

        //Append our html to the container
        ShapeContainer.appendChild(this.html);

        //Set up the display
        this.html.addEventListener('click', this.describe.bind(this))
        this.html.addEventListener('dblclick', this.destroy.bind(this))

        //Give us a random location
        this.newLocation();

        Shapes.push(this);
    }

    newLocation()
    {
        //Choose a new location. They don't quite fit to the left side, so we reduce this location by half of our boudning box.
        this.x = Math.random() * 600 - this.width / 2;
        this.y = Math.random() * 600 - this.height / 2;

        //Fix it so it doesn't clip the edges of the box
        while (this.x < 0)
        {
            this.x++;
        }
        while (this.y < 0)
        {
            this.y++;
        }

        while (this.x + this.width > 600)
        {
            this.x--;
        }
        while (this.y + this.height > 600)
        {
            this.y--;
        }

        //Asign the location into the html
        this.html.style.left = this.x + "px";
        this.html.style.top = this.y + "px";

    }

    describe() 
    {
        ShapeData.name.textContent = this.name;
        ShapeData.width.textContent = `Width: ${this.width}`
        ShapeData.height.textContent = `Height: ${this.height}`
        ShapeData.radius.textContent = `Radius: ${this.radius}`
        ShapeData.area.textContent = `Area: ${this.area}`
        ShapeData.perimeter.textContent = `Perimeter: ${this.perimeter}`
    }

    destroy() {
        Shapes.splice(Shapes.indexOf(this), 1);
        this.html.remove();

        this.name = "Name"
        this.width = "";
        this.height = "";
        this.radius = "";
        this.area = "";
        this.perimeter = "";
        this.describe();
    }
};

class Circle extends Shape
{
    constructor(radius)
    {
        super("Circle", radius * 2, radius * 2, radius, Math.PI * radius * radius, 2 * Math.PI * radius, 284);
    }
}

class Triangle extends Shape
{
    constructor(height)
    {
        super("Triangle", height, height, null, (height * height) / 2, height * 2 + Math.sqrt(height * height + height * height), 50, true, true);
    }
}

class Rectangle extends Shape
{
    constructor(width, height, className, hue)
    {
        if (className == undefined) className = "Rectangle";
        if (hue === undefined) hue = 100;
        super(className, width, height, null, width * height, width * 2 + height * 2, hue);
    }
}

class Square extends Rectangle
{
    constructor(size)
    {
        super(size, size, "Square", 0);
    }
}

//The adding buttons
document.getElementById('square-insert').addEventListener('click', function ()
{
    let size = parseFloat(document.getElementById('square-length').value);
    document.getElementById('square-length').value = "";
    new Square(size);
});

document.getElementById('rect-insert').addEventListener('click', function ()
{
    let width = parseFloat(document.getElementById('rect-width').value);
    let height = parseFloat(document.getElementById('rect-height').value);
    document.getElementById('rect-width').value = "";
    document.getElementById('rect-height').value = "";
    new Rectangle(width, height);
});

document.getElementById('circle-insert').addEventListener('click', function ()
{
    let radius = parseFloat(document.getElementById('circle-radius').value);
    document.getElementById('circle-radius').value = "";
    new Circle(radius);
});

document.getElementById('tri-insert').addEventListener('click', function ()
{
    let height = parseFloat(document.getElementById('tri-height').value);
    document.getElementById('tri-height').value = "";
    new Triangle(height);
});