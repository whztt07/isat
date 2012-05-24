/*global console:true, $:true, document:true
  */
(function () {
    "use strict";                   // make JSHint fascist

    if (typeof(String.prototype.trim) === 'undefined') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "");
        };
    }

    // canvas manager should set the HTML's size of ellipse and
    // viewable universe, so we can scale coords to fit.

    // Test verification file gives
    // mins-from-epoch, x, y, z, vx, vy, vz
    // Testmat claims to give:
    // mins-from-epoch, x, y, z, vx, vy, vz; year, mon, day, hour, min, sec

    // Our satcalc data doesn't render very ellipsoidally,
    // I'm guessing because our interval is too large.
    // We need data with much smaller (one hour?) intervals,
    // and that means we may need to hack testmat_test.html/js
    // to allow us to specify a different type of run than 'v' verify.

    var ellipseMgr = function (ctx, cWidth, cHeight, minX, maxX, minY, maxY, results) {
        // TODO closure to make Initizialized funcs to do the scaling
        console.log("ellipseMgr ctx:", ctx, " results:", results);
        
        var scaleX = function (x) {
            return x * (cWidth - 0) / (maxX - minX) + (cWidth - 0) / 2;
        };

        var scaleY = function (y) {
            return y * (cHeight - 0) / (maxY - minY) + (cHeight - 0) / 2;
        };

        var drawResults = function () {
            var resLines = results.split('\n'),
            len = resLines.length,
            vals, mfe, x, y, sx, sy, i;
            ctx.beginPath();
            for (i = 0; i < len; i += 1) {
                vals = resLines[i].trim().split(/\s+/);
                if (vals.length < 3) {
                    console.warn("ignoring short line: ", resLines[i]);
                    continue;
                }
                mfe = parseFloat(vals.shift()); // minutes from epoch
                x = parseFloat(vals.shift());
                y = parseFloat(vals.shift());
                sx = scaleX(x);
                sy = scaleY(y);
                console.log("drawResults lineTo", x, y, sx, sy);
                if (i === 0) {      // move to first (0th) point instead of drawing
                    ctx.moveTo(sx, sy);
                } else {
                    ctx.lineTo(sx, sy);
                }
            }
            ctx.stroke();           // paint it black
        };

        drawResults();              // do it; get results from ellipseMgr
    };

    $(document).ready(function () {
        var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        satcalcs = document.getElementById('satcalcs').value;
        console.log("doc ready satcals value=", satcalcs);
        ellipseMgr(ctx, 640, 480, -10000, 10000, -10000, 10000, satcalcs);
    });
}());
