$(document).ready(function () {
    needlework.hamburgermenu.init();
});

needlework.hamburgermenu = {
    init: function () {
        //---------------------------------------------------------
        //  Hamburger menu
        //---------------------------------------------------------

        var toogleMenu = false;
        $('#hamburger').click(function () {
            if (!toogleMenu) {
                $('html').css({ overflowX: "hidden" });
                $('body').animate({ left: "400px" }, 500)
                $('#leftMenu').animate({ left: "0px" }, 500);
                $('#hamburger').animate({ left: "500px" }, 500);                              
                toogleMenu = true;
            }
            else {
                $('body').animate({ left: "0px" }, 500);
                $('#leftMenu').animate({ left: "-405px" }, 500);
                $('#hamburger').animate({ left: "100px" },500);
                $('html').css({ overflowX: "auto" }, 500);
                toogleMenu = false;
            }

        });


        // Hambureger Menu     

        (function () {

            function SVGHamburger(el, options) {
                this.el = el;
                this.init();
            }

            SVGHamburger.prototype.init = function () {
                this.shapeEl = this.el.querySelector('span.morph-shape');

                var s = Snap(this.shapeEl.querySelector('svg'));
                this.pathEl1 = s.select('path:nth-of-type(1)');
                this.pathEl2 = s.select('path:nth-of-type(2)');
                this.paths = {
                    reset: {
                        path1: this.pathEl1.attr('d'),
                        path2: this.pathEl2.attr('d')
                    },
                    open: this.shapeEl.getAttribute('data-morph-open').split(';'),
                    close: this.shapeEl.getAttribute('data-morph-close').split(';')
                };

                this.isOpen = false;

                this.initEvents();
            };

            SVGHamburger.prototype.initEvents = function () {
                this.el.addEventListener('click', this.toggle.bind(this));
            };

            SVGHamburger.prototype.toggle = function () {
                var self = this,
                    paths = this.isOpen ? this.paths.close : this.paths.open;

                if (self.isOpen) {
                    setTimeout(function () { classie.remove(self.el, 'menu-button--open'); }, 200);
                }
                else {
                    setTimeout(function () { classie.add(self.el, 'menu-button--open'); }, 200);
                }

                this.pathEl1.stop().animate({ 'path': paths[0] }, 300, mina.easeout, function () {
                    self.pathEl1.stop().animate({ 'path': self.paths.reset.path1 }, 800, mina.elastic);
                });
                this.pathEl2.stop().animate({ 'path': paths[1] }, 300, mina.easeout, function () {
                    self.pathEl2.stop().animate({ 'path': self.paths.reset.path2 }, 800, mina.elastic);
                });

                this.isOpen = !this.isOpen;
            };

            new SVGHamburger(document.getElementById('hamburger'));

        })();

        //---------------------------------------------------------
        //  Hamburger menu end
        //---------------------------------------------------------
    }
}