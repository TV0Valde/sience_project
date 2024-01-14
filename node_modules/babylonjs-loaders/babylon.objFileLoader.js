(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babylonjs"));
	else if(typeof define === 'function' && define.amd)
		define("babylonjs-loaders", ["babylonjs"], factory);
	else if(typeof exports === 'object')
		exports["babylonjs-loaders"] = factory(require("babylonjs"));
	else
		root["LOADERS"] = factory(root["BABYLON"]);
})((typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this), (__WEBPACK_EXTERNAL_MODULE_babylonjs_Misc_observable__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../dev/loaders/src/OBJ/index.ts":
/*!*********************************************!*\
  !*** ../../../dev/loaders/src/OBJ/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MTLFileLoader: () => (/* reexport safe */ _mtlFileLoader__WEBPACK_IMPORTED_MODULE_0__.MTLFileLoader),
/* harmony export */   OBJFileLoader: () => (/* reexport safe */ _objFileLoader__WEBPACK_IMPORTED_MODULE_3__.OBJFileLoader),
/* harmony export */   SolidParser: () => (/* reexport safe */ _solidParser__WEBPACK_IMPORTED_MODULE_2__.SolidParser)
/* harmony export */ });
/* harmony import */ var _mtlFileLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mtlFileLoader */ "../../../dev/loaders/src/OBJ/mtlFileLoader.ts");
/* harmony import */ var _objLoadingOptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objLoadingOptions */ "../../../dev/loaders/src/OBJ/objLoadingOptions.ts");
/* harmony import */ var _solidParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./solidParser */ "../../../dev/loaders/src/OBJ/solidParser.ts");
/* harmony import */ var _objFileLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objFileLoader */ "../../../dev/loaders/src/OBJ/objFileLoader.ts");






/***/ }),

/***/ "../../../dev/loaders/src/OBJ/mtlFileLoader.ts":
/*!*****************************************************!*\
  !*** ../../../dev/loaders/src/OBJ/mtlFileLoader.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MTLFileLoader: () => (/* binding */ MTLFileLoader)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Materials/standardMaterial */ "babylonjs/Misc/observable");
/* harmony import */ var babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__);



/**
 * Class reading and parsing the MTL file bundled with the obj file.
 */
var MTLFileLoader = /** @class */ (function () {
    function MTLFileLoader() {
        /**
         * All material loaded from the mtl will be set here
         */
        this.materials = [];
    }
    /**
     * This function will read the mtl file and create each material described inside
     * This function could be improve by adding :
     * -some component missing (Ni, Tf...)
     * -including the specific options available
     *
     * @param scene defines the scene the material will be created in
     * @param data defines the mtl data to parse
     * @param rootUrl defines the rooturl to use in order to load relative dependencies
     * @param assetContainer defines the asset container to store the material in (can be null)
     */
    MTLFileLoader.prototype.parseMTL = function (scene, data, rootUrl, assetContainer) {
        if (data instanceof ArrayBuffer) {
            return;
        }
        //Split the lines from the file
        var lines = data.split("\n");
        // whitespace char ie: [ \t\r\n\f]
        var delimiter_pattern = /\s+/;
        //Array with RGB colors
        var color;
        //New material
        var material = null;
        //Look at each line
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            // Blank line or comment
            if (line.length === 0 || line.charAt(0) === "#") {
                continue;
            }
            //Get the first parameter (keyword)
            var pos = line.indexOf(" ");
            var key = pos >= 0 ? line.substring(0, pos) : line;
            key = key.toLowerCase();
            //Get the data following the key
            var value = pos >= 0 ? line.substring(pos + 1).trim() : "";
            //This mtl keyword will create the new material
            if (key === "newmtl") {
                //Check if it is the first material.
                // Materials specifications are described after this keyword.
                if (material) {
                    //Add the previous material in the material array.
                    this.materials.push(material);
                }
                //Create a new material.
                // value is the name of the material read in the mtl file
                scene._blockEntityCollection = !!assetContainer;
                material = new babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.StandardMaterial(value, scene);
                material._parentContainer = assetContainer;
                scene._blockEntityCollection = false;
            }
            else if (key === "kd" && material) {
                // Diffuse color (color under white light) using RGB values
                //value  = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set tghe color into the material
                material.diffuseColor = babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.Color3.FromArray(color);
            }
            else if (key === "ka" && material) {
                // Ambient color (color under shadow) using RGB values
                //value = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set tghe color into the material
                material.ambientColor = babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.Color3.FromArray(color);
            }
            else if (key === "ks" && material) {
                // Specular color (color when light is reflected from shiny surface) using RGB values
                //value = "r g b"
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                //color = [r,g,b]
                //Set the color into the material
                material.specularColor = babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.Color3.FromArray(color);
            }
            else if (key === "ke" && material) {
                // Emissive color using RGB values
                color = value.split(delimiter_pattern, 3).map(parseFloat);
                material.emissiveColor = babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.Color3.FromArray(color);
            }
            else if (key === "ns" && material) {
                //value = "Integer"
                material.specularPower = parseFloat(value);
            }
            else if (key === "d" && material) {
                //d is dissolve for current material. It mean alpha for BABYLON
                material.alpha = parseFloat(value);
                //Texture
                //This part can be improved by adding the possible options of texture
            }
            else if (key === "map_ka" && material) {
                // ambient texture map with a loaded image
                //We must first get the folder of the image
                material.ambientTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_kd" && material) {
                // Diffuse texture map with a loaded image
                material.diffuseTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_ks" && material) {
                // Specular texture map with a loaded image
                //We must first get the folder of the image
                material.specularTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
            }
            else if (key === "map_ns") {
                //Specular
                //Specular highlight component
                //We must first get the folder of the image
                //
                //Not supported by BABYLON
                //
                //    continue;
            }
            else if (key === "map_bump" && material) {
                //The bump texture
                var values = value.split(delimiter_pattern);
                var bumpMultiplierIndex = values.indexOf("-bm");
                var bumpMultiplier = null;
                if (bumpMultiplierIndex >= 0) {
                    bumpMultiplier = values[bumpMultiplierIndex + 1];
                    values.splice(bumpMultiplierIndex, 2); // remove
                }
                material.bumpTexture = MTLFileLoader._GetTexture(rootUrl, values.join(" "), scene);
                if (material.bumpTexture && bumpMultiplier !== null) {
                    material.bumpTexture.level = parseFloat(bumpMultiplier);
                }
            }
            else if (key === "map_d" && material) {
                // The dissolve of the material
                material.opacityTexture = MTLFileLoader._GetTexture(rootUrl, value, scene);
                //Options for illumination
            }
            else if (key === "illum") {
                //Illumination
                if (value === "0") {
                    //That mean Kd == Kd
                }
                else if (value === "1") {
                    //Color on and Ambient on
                }
                else if (value === "2") {
                    //Highlight on
                }
                else if (value === "3") {
                    //Reflection on and Ray trace on
                }
                else if (value === "4") {
                    //Transparency: Glass on, Reflection: Ray trace on
                }
                else if (value === "5") {
                    //Reflection: Fresnel on and Ray trace on
                }
                else if (value === "6") {
                    //Transparency: Refraction on, Reflection: Fresnel off and Ray trace on
                }
                else if (value === "7") {
                    //Transparency: Refraction on, Reflection: Fresnel on and Ray trace on
                }
                else if (value === "8") {
                    //Reflection on and Ray trace off
                }
                else if (value === "9") {
                    //Transparency: Glass on, Reflection: Ray trace off
                }
                else if (value === "10") {
                    //Casts shadows onto invisible surfaces
                }
            }
            else {
                // console.log("Unhandled expression at line : " + i +'\n' + "with value : " + line);
            }
        }
        //At the end of the file, add the last material
        if (material) {
            this.materials.push(material);
        }
    };
    /**
     * Gets the texture for the material.
     *
     * If the material is imported from input file,
     * We sanitize the url to ensure it takes the texture from aside the material.
     *
     * @param rootUrl The root url to load from
     * @param value The value stored in the mtl
     * @param scene
     * @returns The Texture
     */
    MTLFileLoader._GetTexture = function (rootUrl, value, scene) {
        if (!value) {
            return null;
        }
        var url = rootUrl;
        // Load from input file.
        if (rootUrl === "file:") {
            var lastDelimiter = value.lastIndexOf("\\");
            if (lastDelimiter === -1) {
                lastDelimiter = value.lastIndexOf("/");
            }
            if (lastDelimiter > -1) {
                url += value.substr(lastDelimiter + 1);
            }
            else {
                url += value;
            }
        }
        // Not from input file.
        else {
            url += value;
        }
        return new babylonjs_Maths_math_color__WEBPACK_IMPORTED_MODULE_0__.Texture(url, scene, false, MTLFileLoader.INVERT_TEXTURE_Y);
    };
    /**
     * Invert Y-Axis of referenced textures on load
     */
    MTLFileLoader.INVERT_TEXTURE_Y = true;
    return MTLFileLoader;
}());


/***/ }),

/***/ "../../../dev/loaders/src/OBJ/objFileLoader.ts":
/*!*****************************************************!*\
  !*** ../../../dev/loaders/src/OBJ/objFileLoader.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OBJFileLoader: () => (/* binding */ OBJFileLoader)
/* harmony export */ });
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/assetContainer */ "babylonjs/Misc/observable");
/* harmony import */ var babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mtlFileLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mtlFileLoader */ "../../../dev/loaders/src/OBJ/mtlFileLoader.ts");
/* harmony import */ var _solidParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./solidParser */ "../../../dev/loaders/src/OBJ/solidParser.ts");






/**
 * OBJ file type loader.
 * This is a babylon scene loader plugin.
 */
var OBJFileLoader = /** @class */ (function () {
    /**
     * Creates loader for .OBJ files
     *
     * @param loadingOptions options for loading and parsing OBJ/MTL files.
     */
    function OBJFileLoader(loadingOptions) {
        /**
         * Defines the name of the plugin.
         */
        this.name = "obj";
        /**
         * Defines the extension the plugin is able to load.
         */
        this.extensions = ".obj";
        this._assetContainer = null;
        this._loadingOptions = loadingOptions || OBJFileLoader._DefaultLoadingOptions;
    }
    Object.defineProperty(OBJFileLoader, "INVERT_TEXTURE_Y", {
        /**
         * Invert Y-Axis of referenced textures on load
         */
        get: function () {
            return _mtlFileLoader__WEBPACK_IMPORTED_MODULE_1__.MTLFileLoader.INVERT_TEXTURE_Y;
        },
        set: function (value) {
            _mtlFileLoader__WEBPACK_IMPORTED_MODULE_1__.MTLFileLoader.INVERT_TEXTURE_Y = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OBJFileLoader, "_DefaultLoadingOptions", {
        get: function () {
            return {
                computeNormals: OBJFileLoader.COMPUTE_NORMALS,
                optimizeNormals: OBJFileLoader.OPTIMIZE_NORMALS,
                importVertexColors: OBJFileLoader.IMPORT_VERTEX_COLORS,
                invertY: OBJFileLoader.INVERT_Y,
                invertTextureY: OBJFileLoader.INVERT_TEXTURE_Y,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                UVScaling: OBJFileLoader.UV_SCALING,
                materialLoadingFailsSilently: OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY,
                optimizeWithUV: OBJFileLoader.OPTIMIZE_WITH_UV,
                skipMaterials: OBJFileLoader.SKIP_MATERIALS,
            };
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Calls synchronously the MTL file attached to this obj.
     * Load function or importMesh function don't enable to load 2 files in the same time asynchronously.
     * Without this function materials are not displayed in the first frame (but displayed after).
     * In consequence it is impossible to get material information in your HTML file
     *
     * @param url The URL of the MTL file
     * @param rootUrl defines where to load data from
     * @param onSuccess Callback function to be called when the MTL file is loaded
     * @param onFailure
     */
    OBJFileLoader.prototype._loadMTL = function (url, rootUrl, onSuccess, onFailure) {
        //The complete path to the mtl file
        var pathOfFile = rootUrl + url;
        // Loads through the babylon tools to allow fileInput search.
        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.LoadFile(pathOfFile, onSuccess, undefined, undefined, false, function (request, exception) {
            onFailure(pathOfFile, exception);
        });
    };
    /**
     * Instantiates a OBJ file loader plugin.
     * @returns the created plugin
     */
    OBJFileLoader.prototype.createPlugin = function () {
        return new OBJFileLoader(OBJFileLoader._DefaultLoadingOptions);
    };
    /**
     * If the data string can be loaded directly.
     * @returns if the data can be loaded directly
     */
    OBJFileLoader.prototype.canDirectLoad = function () {
        return false;
    };
    /**
     * Imports one or more meshes from the loaded OBJ data and adds them to the scene
     * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
     * @param scene the scene the meshes should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise containing the loaded meshes, particles, skeletons and animations
     */
    OBJFileLoader.prototype.importMeshAsync = function (meshesNames, scene, data, rootUrl) {
        //get the meshes from OBJ file
        return this._parseSolid(meshesNames, scene, data, rootUrl).then(function (meshes) {
            return {
                meshes: meshes,
                particleSystems: [],
                skeletons: [],
                animationGroups: [],
                transformNodes: [],
                geometries: [],
                lights: [],
            };
        });
    };
    /**
     * Imports all objects from the loaded OBJ data and adds them to the scene
     * @param scene the scene the objects should be added to
     * @param data the OBJ data to load
     * @param rootUrl root url to load from
     * @returns a promise which completes when objects have been loaded to the scene
     */
    OBJFileLoader.prototype.loadAsync = function (scene, data, rootUrl) {
        //Get the 3D model
        return this.importMeshAsync(null, scene, data, rootUrl).then(function () {
            // return void
        });
    };
    /**
     * Load into an asset container.
     * @param scene The scene to load into
     * @param data The data to import
     * @param rootUrl The root url for scene and resources
     * @returns The loaded asset container
     */
    OBJFileLoader.prototype.loadAssetContainerAsync = function (scene, data, rootUrl) {
        var _this = this;
        var container = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.AssetContainer(scene);
        this._assetContainer = container;
        return this.importMeshAsync(null, scene, data, rootUrl)
            .then(function (result) {
            result.meshes.forEach(function (mesh) { return container.meshes.push(mesh); });
            result.meshes.forEach(function (mesh) {
                var material = mesh.material;
                if (material) {
                    // Materials
                    if (container.materials.indexOf(material) == -1) {
                        container.materials.push(material);
                        // Textures
                        var textures = material.getActiveTextures();
                        textures.forEach(function (t) {
                            if (container.textures.indexOf(t) == -1) {
                                container.textures.push(t);
                            }
                        });
                    }
                }
            });
            _this._assetContainer = null;
            return container;
        })
            .catch(function (ex) {
            _this._assetContainer = null;
            throw ex;
        });
    };
    /**
     * Read the OBJ file and create an Array of meshes.
     * Each mesh contains all information given by the OBJ and the MTL file.
     * i.e. vertices positions and indices, optional normals values, optional UV values, optional material
     * @param meshesNames defines a string or array of strings of the mesh names that should be loaded from the file
     * @param scene defines the scene where are displayed the data
     * @param data defines the content of the obj file
     * @param rootUrl defines the path to the folder
     * @returns the list of loaded meshes
     */
    OBJFileLoader.prototype._parseSolid = function (meshesNames, scene, data, rootUrl) {
        var _this = this;
        var fileToLoad = ""; //The name of the mtlFile to load
        var materialsFromMTLFile = new _mtlFileLoader__WEBPACK_IMPORTED_MODULE_1__.MTLFileLoader();
        var materialToUse = [];
        var babylonMeshesArray = []; //The mesh for babylon
        // Main function
        var solidParser = new _solidParser__WEBPACK_IMPORTED_MODULE_2__.SolidParser(materialToUse, babylonMeshesArray, this._loadingOptions);
        solidParser.parse(meshesNames, data, scene, this._assetContainer, function (fileName) {
            fileToLoad = fileName;
        });
        // load the materials
        var mtlPromises = [];
        // Check if we have a file to load
        if (fileToLoad !== "" && !this._loadingOptions.skipMaterials) {
            //Load the file synchronously
            mtlPromises.push(new Promise(function (resolve, reject) {
                _this._loadMTL(fileToLoad, rootUrl, function (dataLoaded) {
                    try {
                        //Create materials thanks MTLLoader function
                        materialsFromMTLFile.parseMTL(scene, dataLoaded, rootUrl, _this._assetContainer);
                        //Look at each material loaded in the mtl file
                        for (var n = 0; n < materialsFromMTLFile.materials.length; n++) {
                            //Three variables to get all meshes with the same material
                            var startIndex = 0;
                            var _indices = [];
                            var _index = void 0;
                            //The material from MTL file is used in the meshes loaded
                            //Push the indice in an array
                            //Check if the material is not used for another mesh
                            while ((_index = materialToUse.indexOf(materialsFromMTLFile.materials[n].name, startIndex)) > -1) {
                                _indices.push(_index);
                                startIndex = _index + 1;
                            }
                            //If the material is not used dispose it
                            if (_index === -1 && _indices.length === 0) {
                                //If the material is not needed, remove it
                                materialsFromMTLFile.materials[n].dispose();
                            }
                            else {
                                for (var o = 0; o < _indices.length; o++) {
                                    //Apply the material to the Mesh for each mesh with the material
                                    var mesh = babylonMeshesArray[_indices[o]];
                                    var material = materialsFromMTLFile.materials[n];
                                    mesh.material = material;
                                    if (!mesh.getTotalIndices()) {
                                        // No indices, we need to turn on point cloud
                                        material.pointsCloud = true;
                                    }
                                }
                            }
                        }
                        resolve();
                    }
                    catch (e) {
                        babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Error processing MTL file: '".concat(fileToLoad, "'"));
                        if (_this._loadingOptions.materialLoadingFailsSilently) {
                            resolve();
                        }
                        else {
                            reject(e);
                        }
                    }
                }, function (pathOfFile, exception) {
                    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Tools.Warn("Error downloading MTL file: '".concat(fileToLoad, "'"));
                    if (_this._loadingOptions.materialLoadingFailsSilently) {
                        resolve();
                    }
                    else {
                        reject(exception);
                    }
                });
            }));
        }
        //Return an array with all Mesh
        return Promise.all(mtlPromises).then(function () {
            return babylonMeshesArray;
        });
    };
    /**
     * Defines if UVs are optimized by default during load.
     */
    OBJFileLoader.OPTIMIZE_WITH_UV = true;
    /**
     * Invert model on y-axis (does a model scaling inversion)
     */
    OBJFileLoader.INVERT_Y = false;
    /**
     * Include in meshes the vertex colors available in some OBJ files.  This is not part of OBJ standard.
     */
    OBJFileLoader.IMPORT_VERTEX_COLORS = false;
    /**
     * Compute the normals for the model, even if normals are present in the file.
     */
    OBJFileLoader.COMPUTE_NORMALS = false;
    /**
     * Optimize the normals for the model. Lighting can be uneven if you use OptimizeWithUV = true because new vertices can be created for the same location if they pertain to different faces.
     * Using OptimizehNormals = true will help smoothing the lighting by averaging the normals of those vertices.
     */
    OBJFileLoader.OPTIMIZE_NORMALS = false;
    /**
     * Defines custom scaling of UV coordinates of loaded meshes.
     */
    OBJFileLoader.UV_SCALING = new babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.Vector2(1, 1);
    /**
     * Skip loading the materials even if defined in the OBJ file (materials are ignored).
     */
    OBJFileLoader.SKIP_MATERIALS = false;
    /**
     * When a material fails to load OBJ loader will silently fail and onSuccess() callback will be triggered.
     *
     * Defaults to true for backwards compatibility.
     */
    OBJFileLoader.MATERIAL_LOADING_FAILS_SILENTLY = true;
    return OBJFileLoader;
}());
if (babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.SceneLoader) {
    //Add this loader into the register plugin
    babylonjs_Maths_math_vector__WEBPACK_IMPORTED_MODULE_0__.SceneLoader.RegisterPlugin(new OBJFileLoader());
}


/***/ }),

/***/ "../../../dev/loaders/src/OBJ/objLoadingOptions.ts":
/*!*********************************************************!*\
  !*** ../../../dev/loaders/src/OBJ/objLoadingOptions.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "../../../dev/loaders/src/OBJ/solidParser.ts":
/*!***************************************************!*\
  !*** ../../../dev/loaders/src/OBJ/solidParser.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SolidParser: () => (/* binding */ SolidParser)
/* harmony export */ });
/* harmony import */ var babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babylonjs/Meshes/mesh.vertexData */ "babylonjs/Misc/observable");
/* harmony import */ var babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__);







/**
 * Class used to load mesh data from OBJ content
 */
var SolidParser = /** @class */ (function () {
    /**
     * Creates a new SolidParser
     * @param materialToUse defines the array to fill with the list of materials to use (it will be filled by the parse function)
     * @param babylonMeshesArray defines the array to fill with the list of loaded meshes (it will be filled by the parse function)
     * @param loadingOptions defines the loading options to use
     */
    function SolidParser(materialToUse, babylonMeshesArray, loadingOptions) {
        this._positions = []; //values for the positions of vertices
        this._normals = []; //Values for the normals
        this._uvs = []; //Values for the textures
        this._colors = [];
        this._meshesFromObj = []; //[mesh] Contains all the obj meshes
        this._indicesForBabylon = []; //The list of indices for VertexData
        this._wrappedPositionForBabylon = []; //The list of position in vectors
        this._wrappedUvsForBabylon = []; //Array with all value of uvs to match with the indices
        this._wrappedColorsForBabylon = []; // Array with all color values to match with the indices
        this._wrappedNormalsForBabylon = []; //Array with all value of normals to match with the indices
        this._tuplePosNorm = []; //Create a tuple with indice of Position, Normal, UV  [pos, norm, uvs]
        this._curPositionInIndices = 0;
        this._hasMeshes = false; //Meshes are defined in the file
        this._unwrappedPositionsForBabylon = []; //Value of positionForBabylon w/o Vector3() [x,y,z]
        this._unwrappedColorsForBabylon = []; // Value of colorForBabylon w/o Color4() [r,g,b,a]
        this._unwrappedNormalsForBabylon = []; //Value of normalsForBabylon w/o Vector3()  [x,y,z]
        this._unwrappedUVForBabylon = []; //Value of uvsForBabylon w/o Vector3()      [x,y,z]
        this._triangles = []; //Indices from new triangles coming from polygons
        this._materialNameFromObj = ""; //The name of the current material
        this._objMeshName = ""; //The name of the current obj mesh
        this._increment = 1; //Id for meshes created by the multimaterial
        this._isFirstMaterial = true;
        this._grayColor = new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Color4(0.5, 0.5, 0.5, 1);
        this._materialToUse = materialToUse;
        this._babylonMeshesArray = babylonMeshesArray;
        this._loadingOptions = loadingOptions;
    }
    /**
     * Search for obj in the given array.
     * This function is called to check if a couple of data already exists in an array.
     *
     * If found, returns the index of the founded tuple index. Returns -1 if not found
     * @param arr Array<{ normals: Array<number>, idx: Array<number> }>
     * @param obj Array<number>
     * @returns {boolean}
     */
    SolidParser.prototype._isInArray = function (arr, obj) {
        if (!arr[obj[0]]) {
            arr[obj[0]] = { normals: [], idx: [] };
        }
        var idx = arr[obj[0]].normals.indexOf(obj[1]);
        return idx === -1 ? -1 : arr[obj[0]].idx[idx];
    };
    SolidParser.prototype._isInArrayUV = function (arr, obj) {
        if (!arr[obj[0]]) {
            arr[obj[0]] = { normals: [], idx: [], uv: [] };
        }
        var idx = arr[obj[0]].normals.indexOf(obj[1]);
        if (idx != 1 && obj[2] === arr[obj[0]].uv[idx]) {
            return arr[obj[0]].idx[idx];
        }
        return -1;
    };
    /**
     * This function set the data for each triangle.
     * Data are position, normals and uvs
     * If a tuple of (position, normal) is not set, add the data into the corresponding array
     * If the tuple already exist, add only their indice
     *
     * @param indicePositionFromObj Integer The index in positions array
     * @param indiceUvsFromObj Integer The index in uvs array
     * @param indiceNormalFromObj Integer The index in normals array
     * @param positionVectorFromOBJ Vector3 The value of position at index objIndice
     * @param textureVectorFromOBJ Vector3 The value of uvs
     * @param normalsVectorFromOBJ Vector3 The value of normals at index objNormale
     * @param positionColorsFromOBJ
     */
    SolidParser.prototype._setData = function (indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, positionVectorFromOBJ, textureVectorFromOBJ, normalsVectorFromOBJ, positionColorsFromOBJ) {
        //Check if this tuple already exists in the list of tuples
        var _index;
        if (this._loadingOptions.optimizeWithUV) {
            _index = this._isInArrayUV(this._tuplePosNorm, [indicePositionFromObj, indiceNormalFromObj, indiceUvsFromObj]);
        }
        else {
            _index = this._isInArray(this._tuplePosNorm, [indicePositionFromObj, indiceNormalFromObj]);
        }
        //If it not exists
        if (_index === -1) {
            //Add an new indice.
            //The array of indices is only an array with his length equal to the number of triangles - 1.
            //We add vertices data in this order
            this._indicesForBabylon.push(this._wrappedPositionForBabylon.length);
            //Push the position of vertice for Babylon
            //Each element is a Vector3(x,y,z)
            this._wrappedPositionForBabylon.push(positionVectorFromOBJ);
            //Push the uvs for Babylon
            //Each element is a Vector3(u,v)
            this._wrappedUvsForBabylon.push(textureVectorFromOBJ);
            //Push the normals for Babylon
            //Each element is a Vector3(x,y,z)
            this._wrappedNormalsForBabylon.push(normalsVectorFromOBJ);
            if (positionColorsFromOBJ !== undefined) {
                //Push the colors for Babylon
                //Each element is a BABYLON.Color4(r,g,b,a)
                this._wrappedColorsForBabylon.push(positionColorsFromOBJ);
            }
            //Add the tuple in the comparison list
            this._tuplePosNorm[indicePositionFromObj].normals.push(indiceNormalFromObj);
            this._tuplePosNorm[indicePositionFromObj].idx.push(this._curPositionInIndices++);
            if (this._loadingOptions.optimizeWithUV) {
                this._tuplePosNorm[indicePositionFromObj].uv.push(indiceUvsFromObj);
            }
        }
        else {
            //The tuple already exists
            //Add the index of the already existing tuple
            //At this index we can get the value of position, normal, color and uvs of vertex
            this._indicesForBabylon.push(_index);
        }
    };
    /**
     * Transform Vector() and BABYLON.Color() objects into numbers in an array
     */
    SolidParser.prototype._unwrapData = function () {
        //Every array has the same length
        for (var l = 0; l < this._wrappedPositionForBabylon.length; l++) {
            //Push the x, y, z values of each element in the unwrapped array
            this._unwrappedPositionsForBabylon.push(this._wrappedPositionForBabylon[l].x, this._wrappedPositionForBabylon[l].y, this._wrappedPositionForBabylon[l].z);
            this._unwrappedNormalsForBabylon.push(this._wrappedNormalsForBabylon[l].x, this._wrappedNormalsForBabylon[l].y, this._wrappedNormalsForBabylon[l].z);
            this._unwrappedUVForBabylon.push(this._wrappedUvsForBabylon[l].x, this._wrappedUvsForBabylon[l].y); //z is an optional value not supported by BABYLON
            if (this._loadingOptions.importVertexColors) {
                //Push the r, g, b, a values of each element in the unwrapped array
                this._unwrappedColorsForBabylon.push(this._wrappedColorsForBabylon[l].r, this._wrappedColorsForBabylon[l].g, this._wrappedColorsForBabylon[l].b, this._wrappedColorsForBabylon[l].a);
            }
        }
        // Reset arrays for the next new meshes
        this._wrappedPositionForBabylon.length = 0;
        this._wrappedNormalsForBabylon.length = 0;
        this._wrappedUvsForBabylon.length = 0;
        this._wrappedColorsForBabylon.length = 0;
        this._tuplePosNorm.length = 0;
        this._curPositionInIndices = 0;
    };
    /**
     * Create triangles from polygons
     * It is important to notice that a triangle is a polygon
     * We get 5 patterns of face defined in OBJ File :
     * facePattern1 = ["1","2","3","4","5","6"]
     * facePattern2 = ["1/1","2/2","3/3","4/4","5/5","6/6"]
     * facePattern3 = ["1/1/1","2/2/2","3/3/3","4/4/4","5/5/5","6/6/6"]
     * facePattern4 = ["1//1","2//2","3//3","4//4","5//5","6//6"]
     * facePattern5 = ["-1/-1/-1","-2/-2/-2","-3/-3/-3","-4/-4/-4","-5/-5/-5","-6/-6/-6"]
     * Each pattern is divided by the same method
     * @param faces Array[String] The indices of elements
     * @param v Integer The variable to increment
     */
    SolidParser.prototype._getTriangles = function (faces, v) {
        //Work for each element of the array
        for (var faceIndex = v; faceIndex < faces.length - 1; faceIndex++) {
            //Add on the triangle variable the indexes to obtain triangles
            this._triangles.push(faces[0], faces[faceIndex], faces[faceIndex + 1]);
        }
        //Result obtained after 2 iterations:
        //Pattern1 => triangle = ["1","2","3","1","3","4"];
        //Pattern2 => triangle = ["1/1","2/2","3/3","1/1","3/3","4/4"];
        //Pattern3 => triangle = ["1/1/1","2/2/2","3/3/3","1/1/1","3/3/3","4/4/4"];
        //Pattern4 => triangle = ["1//1","2//2","3//3","1//1","3//3","4//4"];
        //Pattern5 => triangle = ["-1/-1/-1","-2/-2/-2","-3/-3/-3","-1/-1/-1","-3/-3/-3","-4/-4/-4"];
    };
    /**
     * Create triangles and push the data for each polygon for the pattern 1
     * In this pattern we get vertice positions
     * @param face
     * @param v
     */
    SolidParser.prototype._setDataForCurrentFaceWithPattern1 = function (face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        //For each element in the triangles array.
        //This var could contains 1 to an infinity of triangles
        for (var k = 0; k < this._triangles.length; k++) {
            // Set position indice
            var indicePositionFromObj = parseInt(this._triangles[k]) - 1;
            this._setData(indicePositionFromObj, 0, 0, // In the pattern 1, normals and uvs are not defined
            this._positions[indicePositionFromObj], // Get the vectors data
            babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector2.Zero(), babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector3.Up(), // Create default vectors
            this._loadingOptions.importVertexColors ? this._colors[indicePositionFromObj] : undefined);
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    };
    /**
     * Create triangles and push the data for each polygon for the pattern 2
     * In this pattern we get vertice positions and uvs
     * @param face
     * @param v
     */
    SolidParser.prototype._setDataForCurrentFaceWithPattern2 = function (face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (var k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1/1"
            //Split the data for getting position and uv
            var point = this._triangles[k].split("/"); // ["1", "1"]
            //Set position indice
            var indicePositionFromObj = parseInt(point[0]) - 1;
            //Set uv indice
            var indiceUvsFromObj = parseInt(point[1]) - 1;
            this._setData(indicePositionFromObj, indiceUvsFromObj, 0, //Default value for normals
            this._positions[indicePositionFromObj], //Get the values for each element
            this._uvs[indiceUvsFromObj], babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector3.Up(), //Default value for normals
            this._loadingOptions.importVertexColors ? this._colors[indicePositionFromObj] : undefined);
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    };
    /**
     * Create triangles and push the data for each polygon for the pattern 3
     * In this pattern we get vertice positions, uvs and normals
     * @param face
     * @param v
     */
    SolidParser.prototype._setDataForCurrentFaceWithPattern3 = function (face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (var k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1/1/1"
            //Split the data for getting position, uv, and normals
            var point = this._triangles[k].split("/"); // ["1", "1", "1"]
            // Set position indice
            var indicePositionFromObj = parseInt(point[0]) - 1;
            // Set uv indice
            var indiceUvsFromObj = parseInt(point[1]) - 1;
            // Set normal indice
            var indiceNormalFromObj = parseInt(point[2]) - 1;
            this._setData(indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, this._positions[indicePositionFromObj], this._uvs[indiceUvsFromObj], this._normals[indiceNormalFromObj] //Set the vector for each component
            );
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    };
    /**
     * Create triangles and push the data for each polygon for the pattern 4
     * In this pattern we get vertice positions and normals
     * @param face
     * @param v
     */
    SolidParser.prototype._setDataForCurrentFaceWithPattern4 = function (face, v) {
        this._getTriangles(face, v);
        for (var k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "1//1"
            //Split the data for getting position and normals
            var point = this._triangles[k].split("//"); // ["1", "1"]
            // We check indices, and normals
            var indicePositionFromObj = parseInt(point[0]) - 1;
            var indiceNormalFromObj = parseInt(point[1]) - 1;
            this._setData(indicePositionFromObj, 1, //Default value for uv
            indiceNormalFromObj, this._positions[indicePositionFromObj], //Get each vector of data
            babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector2.Zero(), this._normals[indiceNormalFromObj], this._loadingOptions.importVertexColors ? this._colors[indicePositionFromObj] : undefined);
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    };
    /*
     * Create triangles and push the data for each polygon for the pattern 3
     * In this pattern we get vertice positions, uvs and normals
     * @param face
     * @param v
     */
    SolidParser.prototype._setDataForCurrentFaceWithPattern5 = function (face, v) {
        //Get the indices of triangles for each polygon
        this._getTriangles(face, v);
        for (var k = 0; k < this._triangles.length; k++) {
            //triangle[k] = "-1/-1/-1"
            //Split the data for getting position, uv, and normals
            var point = this._triangles[k].split("/"); // ["-1", "-1", "-1"]
            // Set position indice
            var indicePositionFromObj = this._positions.length + parseInt(point[0]);
            // Set uv indice
            var indiceUvsFromObj = this._uvs.length + parseInt(point[1]);
            // Set normal indice
            var indiceNormalFromObj = this._normals.length + parseInt(point[2]);
            this._setData(indicePositionFromObj, indiceUvsFromObj, indiceNormalFromObj, this._positions[indicePositionFromObj], this._uvs[indiceUvsFromObj], this._normals[indiceNormalFromObj], //Set the vector for each component
            this._loadingOptions.importVertexColors ? this._colors[indicePositionFromObj] : undefined);
        }
        //Reset variable for the next line
        this._triangles.length = 0;
    };
    SolidParser.prototype._addPreviousObjMesh = function () {
        //Check if it is not the first mesh. Otherwise we don't have data.
        if (this._meshesFromObj.length > 0) {
            //Get the previous mesh for applying the data about the faces
            //=> in obj file, faces definition append after the name of the mesh
            this._handledMesh = this._meshesFromObj[this._meshesFromObj.length - 1];
            //Set the data into Array for the mesh
            this._unwrapData();
            // Reverse tab. Otherwise face are displayed in the wrong sens
            this._indicesForBabylon.reverse();
            //Set the information for the mesh
            //Slice the array to avoid rewriting because of the fact this is the same var which be rewrited
            this._handledMesh.indices = this._indicesForBabylon.slice();
            this._handledMesh.positions = this._unwrappedPositionsForBabylon.slice();
            this._handledMesh.normals = this._unwrappedNormalsForBabylon.slice();
            this._handledMesh.uvs = this._unwrappedUVForBabylon.slice();
            if (this._loadingOptions.importVertexColors) {
                this._handledMesh.colors = this._unwrappedColorsForBabylon.slice();
            }
            //Reset the array for the next mesh
            this._indicesForBabylon.length = 0;
            this._unwrappedPositionsForBabylon.length = 0;
            this._unwrappedColorsForBabylon.length = 0;
            this._unwrappedNormalsForBabylon.length = 0;
            this._unwrappedUVForBabylon.length = 0;
        }
    };
    SolidParser.prototype._optimizeNormals = function (mesh) {
        var positions = mesh.getVerticesData(babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.PositionKind);
        var normals = mesh.getVerticesData(babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind);
        var mapVertices = {};
        if (!positions || !normals) {
            return;
        }
        for (var i = 0; i < positions.length / 3; i++) {
            var x = positions[i * 3 + 0];
            var y = positions[i * 3 + 1];
            var z = positions[i * 3 + 2];
            var key = x + "_" + y + "_" + z;
            var lst = mapVertices[key];
            if (!lst) {
                lst = [];
                mapVertices[key] = lst;
            }
            lst.push(i);
        }
        var normal = new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector3();
        for (var key in mapVertices) {
            var lst = mapVertices[key];
            if (lst.length < 2) {
                continue;
            }
            var v0Idx = lst[0];
            for (var i = 1; i < lst.length; ++i) {
                var vIdx = lst[i];
                normals[v0Idx * 3 + 0] += normals[vIdx * 3 + 0];
                normals[v0Idx * 3 + 1] += normals[vIdx * 3 + 1];
                normals[v0Idx * 3 + 2] += normals[vIdx * 3 + 2];
            }
            normal.copyFromFloats(normals[v0Idx * 3 + 0], normals[v0Idx * 3 + 1], normals[v0Idx * 3 + 2]);
            normal.normalize();
            for (var i = 0; i < lst.length; ++i) {
                var vIdx = lst[i];
                normals[vIdx * 3 + 0] = normal.x;
                normals[vIdx * 3 + 1] = normal.y;
                normals[vIdx * 3 + 2] = normal.z;
            }
        }
        mesh.setVerticesData(babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.VertexBuffer.NormalKind, normals);
    };
    /**
     * Function used to parse an OBJ string
     * @param meshesNames defines the list of meshes to load (all if not defined)
     * @param data defines the OBJ string
     * @param scene defines the hosting scene
     * @param assetContainer defines the asset container to load data in
     * @param onFileToLoadFound defines a callback that will be called if a MTL file is found
     */
    SolidParser.prototype.parse = function (meshesNames, data, scene, assetContainer, onFileToLoadFound) {
        var _a;
        // Split the file into lines
        var lines = data.split("\n");
        // Look at each line
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim().replace(/\s\s/g, " ");
            var result = void 0;
            // Comment or newLine
            if (line.length === 0 || line.charAt(0) === "#") {
                continue;
                //Get information about one position possible for the vertices
            }
            else if (SolidParser.VertexPattern.test(line)) {
                result = line.match(/[^ ]+/g); // match will return non-null due to passing regex pattern
                // Value of result with line: "v 1.0 2.0 3.0"
                // ["v", "1.0", "2.0", "3.0"]
                // Create a Vector3 with the position x, y, z
                this._positions.push(new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
                if (this._loadingOptions.importVertexColors) {
                    if (result.length >= 7) {
                        var r = parseFloat(result[4]);
                        var g = parseFloat(result[5]);
                        var b = parseFloat(result[6]);
                        this._colors.push(new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Color4(r > 1 ? r / 255 : r, g > 1 ? g / 255 : g, b > 1 ? b / 255 : b, result.length === 7 || result[7] === undefined ? 1 : parseFloat(result[7])));
                    }
                    else {
                        // TODO: maybe push NULL and if all are NULL to skip (and remove grayColor var).
                        this._colors.push(this._grayColor);
                    }
                }
            }
            else if ((result = SolidParser.NormalPattern.exec(line)) !== null) {
                //Create a Vector3 with the normals x, y, z
                //Value of result
                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                //Add the Vector in the list of normals
                this._normals.push(new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])));
            }
            else if ((result = SolidParser.UVPattern.exec(line)) !== null) {
                //Create a Vector2 with the normals u, v
                //Value of result
                // ["vt 0.1 0.2 0.3", "0.1", "0.2"]
                //Add the Vector in the list of uvs
                this._uvs.push(new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Vector2(parseFloat(result[1]) * this._loadingOptions.UVScaling.x, parseFloat(result[2]) * this._loadingOptions.UVScaling.y));
                //Identify patterns of faces
                //Face could be defined in different type of pattern
            }
            else if ((result = SolidParser.FacePattern3.exec(line)) !== null) {
                //Value of result:
                //["f 1/1/1 2/2/2 3/3/3", "1/1/1 2/2/2 3/3/3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern3(result[1].trim().split(" "), // ["1/1/1", "2/2/2", "3/3/3"]
                1);
            }
            else if ((result = SolidParser.FacePattern4.exec(line)) !== null) {
                //Value of result:
                //["f 1//1 2//2 3//3", "1//1 2//2 3//3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern4(result[1].trim().split(" "), // ["1//1", "2//2", "3//3"]
                1);
            }
            else if ((result = SolidParser.FacePattern5.exec(line)) !== null) {
                //Value of result:
                //["f -1/-1/-1 -2/-2/-2 -3/-3/-3", "-1/-1/-1 -2/-2/-2 -3/-3/-3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern5(result[1].trim().split(" "), // ["-1/-1/-1", "-2/-2/-2", "-3/-3/-3"]
                1);
            }
            else if ((result = SolidParser.FacePattern2.exec(line)) !== null) {
                //Value of result:
                //["f 1/1 2/2 3/3", "1/1 2/2 3/3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern2(result[1].trim().split(" "), // ["1/1", "2/2", "3/3"]
                1);
            }
            else if ((result = SolidParser.FacePattern1.exec(line)) !== null) {
                //Value of result
                //["f 1 2 3", "1 2 3"...]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern1(result[1].trim().split(" "), // ["1", "2", "3"]
                1);
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser.LinePattern1.exec(line)) !== null) {
                //Value of result
                //["l 1 2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern1(result[1].trim().split(" "), // ["1", "2"]
                0);
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser.LinePattern2.exec(line)) !== null) {
                //Value of result
                //["l 1/1 2/2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern2(result[1].trim().split(" "), // ["1/1", "2/2"]
                0);
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if ((result = SolidParser.LinePattern3.exec(line)) !== null) {
                //Value of result
                //["l 1/1/1 2/2/2"]
                //Set the data for this face
                this._setDataForCurrentFaceWithPattern3(result[1].trim().split(" "), // ["1/1/1", "2/2/2"]
                0);
                // Define a mesh or an object
                // Each time this keyword is analyzed, create a new Object with all data for creating a babylonMesh
            }
            else if (SolidParser.GroupDescriptor.test(line) || SolidParser.ObjectDescriptor.test(line)) {
                // Create a new mesh corresponding to the name of the group.
                // Definition of the mesh
                var objMesh = {
                    name: line.substring(2).trim(),
                    indices: undefined,
                    positions: undefined,
                    normals: undefined,
                    uvs: undefined,
                    colors: undefined,
                    materialName: this._materialNameFromObj,
                    isObject: SolidParser.ObjectDescriptor.test(line),
                };
                this._addPreviousObjMesh();
                //Push the last mesh created with only the name
                this._meshesFromObj.push(objMesh);
                //Set this variable to indicate that now meshesFromObj has objects defined inside
                this._hasMeshes = true;
                this._isFirstMaterial = true;
                this._increment = 1;
                //Keyword for applying a material
            }
            else if (SolidParser.UseMtlDescriptor.test(line)) {
                //Get the name of the material
                this._materialNameFromObj = line.substring(7).trim();
                //If this new material is in the same mesh
                if (!this._isFirstMaterial || !this._hasMeshes) {
                    //Set the data for the previous mesh
                    this._addPreviousObjMesh();
                    //Create a new mesh
                    var objMesh = 
                    //Set the name of the current obj mesh
                    {
                        name: (this._objMeshName || "mesh") + "_mm" + this._increment.toString(),
                        indices: undefined,
                        positions: undefined,
                        normals: undefined,
                        uvs: undefined,
                        colors: undefined,
                        materialName: this._materialNameFromObj,
                        isObject: false,
                    };
                    this._increment++;
                    //If meshes are already defined
                    this._meshesFromObj.push(objMesh);
                    this._hasMeshes = true;
                }
                //Set the material name if the previous line define a mesh
                if (this._hasMeshes && this._isFirstMaterial) {
                    //Set the material name to the previous mesh (1 material per mesh)
                    this._meshesFromObj[this._meshesFromObj.length - 1].materialName = this._materialNameFromObj;
                    this._isFirstMaterial = false;
                }
                // Keyword for loading the mtl file
            }
            else if (SolidParser.MtlLibGroupDescriptor.test(line)) {
                // Get the name of mtl file
                onFileToLoadFound(line.substring(7).trim());
                // Apply smoothing
            }
            else if (SolidParser.SmoothDescriptor.test(line)) {
                // smooth shading => apply smoothing
                // Today I don't know it work with babylon and with obj.
                // With the obj file  an integer is set
            }
            else {
                //If there is another possibility
                console.log("Unhandled expression at line : " + line);
            }
        }
        // At the end of the file, add the last mesh into the meshesFromObj array
        if (this._hasMeshes) {
            // Set the data for the last mesh
            this._handledMesh = this._meshesFromObj[this._meshesFromObj.length - 1];
            //Reverse indices for displaying faces in the good sense
            this._indicesForBabylon.reverse();
            //Get the good array
            this._unwrapData();
            //Set array
            this._handledMesh.indices = this._indicesForBabylon;
            this._handledMesh.positions = this._unwrappedPositionsForBabylon;
            this._handledMesh.normals = this._unwrappedNormalsForBabylon;
            this._handledMesh.uvs = this._unwrappedUVForBabylon;
            if (this._loadingOptions.importVertexColors) {
                this._handledMesh.colors = this._unwrappedColorsForBabylon;
            }
        }
        // If any o or g keyword not found, create a mesh with a random id
        if (!this._hasMeshes) {
            var newMaterial = null;
            if (this._indicesForBabylon.length) {
                // reverse tab of indices
                this._indicesForBabylon.reverse();
                //Get positions normals uvs
                this._unwrapData();
            }
            else {
                // There is no indices in the file. We will have to switch to point cloud rendering
                for (var _i = 0, _b = this._positions; _i < _b.length; _i++) {
                    var pos = _b[_i];
                    this._unwrappedPositionsForBabylon.push(pos.x, pos.y, pos.z);
                }
                if (this._normals.length) {
                    for (var _c = 0, _d = this._normals; _c < _d.length; _c++) {
                        var normal = _d[_c];
                        this._unwrappedNormalsForBabylon.push(normal.x, normal.y, normal.z);
                    }
                }
                if (this._uvs.length) {
                    for (var _e = 0, _f = this._uvs; _e < _f.length; _e++) {
                        var uv = _f[_e];
                        this._unwrappedUVForBabylon.push(uv.x, uv.y);
                    }
                }
                if (this._colors.length) {
                    for (var _g = 0, _h = this._colors; _g < _h.length; _g++) {
                        var color = _h[_g];
                        this._unwrappedColorsForBabylon.push(color.r, color.g, color.b, color.a);
                    }
                }
                if (!this._materialNameFromObj) {
                    // Create a material with point cloud on
                    newMaterial = new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.StandardMaterial(babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Geometry.RandomId(), scene);
                    newMaterial.pointsCloud = true;
                    this._materialNameFromObj = newMaterial.name;
                    if (!this._normals.length) {
                        newMaterial.disableLighting = true;
                        newMaterial.emissiveColor = babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Color3.White();
                    }
                }
            }
            //Set data for one mesh
            this._meshesFromObj.push({
                name: babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Geometry.RandomId(),
                indices: this._indicesForBabylon,
                positions: this._unwrappedPositionsForBabylon,
                colors: this._unwrappedColorsForBabylon,
                normals: this._unwrappedNormalsForBabylon,
                uvs: this._unwrappedUVForBabylon,
                materialName: this._materialNameFromObj,
                directMaterial: newMaterial,
                isObject: true,
            });
        }
        //Set data for each mesh
        for (var j = 0; j < this._meshesFromObj.length; j++) {
            //check meshesNames (stlFileLoader)
            if (meshesNames && this._meshesFromObj[j].name) {
                if (meshesNames instanceof Array) {
                    if (meshesNames.indexOf(this._meshesFromObj[j].name) === -1) {
                        continue;
                    }
                }
                else {
                    if (this._meshesFromObj[j].name !== meshesNames) {
                        continue;
                    }
                }
            }
            //Get the current mesh
            //Set the data with VertexBuffer for each mesh
            this._handledMesh = this._meshesFromObj[j];
            //Create a Mesh with the name of the obj mesh
            scene._blockEntityCollection = !!assetContainer;
            var babylonMesh = new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.Mesh(this._meshesFromObj[j].name, scene);
            babylonMesh._parentContainer = assetContainer;
            scene._blockEntityCollection = false;
            this._handledMesh._babylonMesh = babylonMesh;
            // If this is a group mesh, it should have an object mesh as a parent. So look for the first object mesh that appears before it.
            if (!this._handledMesh.isObject) {
                for (var k = j - 1; k >= 0; --k) {
                    if (this._meshesFromObj[k].isObject && this._meshesFromObj[k]._babylonMesh) {
                        babylonMesh.parent = this._meshesFromObj[k]._babylonMesh;
                        break;
                    }
                }
            }
            //Push the name of the material to an array
            //This is indispensable for the importMesh function
            this._materialToUse.push(this._meshesFromObj[j].materialName);
            if (((_a = this._handledMesh.positions) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                //Push the mesh into an array
                this._babylonMeshesArray.push(babylonMesh);
                continue;
            }
            var vertexData = new babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.VertexData(); //The container for the values
            //Set the data for the babylonMesh
            vertexData.uvs = this._handledMesh.uvs;
            vertexData.indices = this._handledMesh.indices;
            vertexData.positions = this._handledMesh.positions;
            if (this._loadingOptions.computeNormals) {
                var normals = new Array();
                babylonjs_Buffers_buffer__WEBPACK_IMPORTED_MODULE_0__.VertexData.ComputeNormals(this._handledMesh.positions, this._handledMesh.indices, normals);
                vertexData.normals = normals;
            }
            else {
                vertexData.normals = this._handledMesh.normals;
            }
            if (this._loadingOptions.importVertexColors) {
                vertexData.colors = this._handledMesh.colors;
            }
            //Set the data from the VertexBuffer to the current Mesh
            vertexData.applyToMesh(babylonMesh);
            if (this._loadingOptions.invertY) {
                babylonMesh.scaling.y *= -1;
            }
            if (this._loadingOptions.optimizeNormals) {
                this._optimizeNormals(babylonMesh);
            }
            //Push the mesh into an array
            this._babylonMeshesArray.push(babylonMesh);
            if (this._handledMesh.directMaterial) {
                babylonMesh.material = this._handledMesh.directMaterial;
            }
        }
    };
    // Descriptor
    /** Object descriptor */
    SolidParser.ObjectDescriptor = /^o/;
    /** Group descriptor */
    SolidParser.GroupDescriptor = /^g/;
    /** Material lib descriptor */
    SolidParser.MtlLibGroupDescriptor = /^mtllib /;
    /** Use a material descriptor */
    SolidParser.UseMtlDescriptor = /^usemtl /;
    /** Smooth descriptor */
    SolidParser.SmoothDescriptor = /^s /;
    // Patterns
    /** Pattern used to detect a vertex */
    SolidParser.VertexPattern = /^v(\s+[\d|.|+|\-|e|E]+){3,7}/;
    /** Pattern used to detect a normal */
    SolidParser.NormalPattern = /^vn(\s+[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)/;
    /** Pattern used to detect a UV set */
    SolidParser.UVPattern = /^vt(\s+[\d|.|+|\-|e|E]+)( +[\d|.|+|\-|e|E]+)/;
    /** Pattern used to detect a first kind of face (f vertex vertex vertex) */
    SolidParser.FacePattern1 = /^f\s+(([\d]{1,}[\s]?){3,})+/;
    /** Pattern used to detect a second kind of face (f vertex/uvs vertex/uvs vertex/uvs) */
    SolidParser.FacePattern2 = /^f\s+((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
    /** Pattern used to detect a third kind of face (f vertex/uvs/normal vertex/uvs/normal vertex/uvs/normal) */
    SolidParser.FacePattern3 = /^f\s+((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
    /** Pattern used to detect a fourth kind of face (f vertex//normal vertex//normal vertex//normal)*/
    SolidParser.FacePattern4 = /^f\s+((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/;
    /** Pattern used to detect a fifth kind of face (f -vertex/-uvs/-normal -vertex/-uvs/-normal -vertex/-uvs/-normal) */
    SolidParser.FacePattern5 = /^f\s+(((-[\d]{1,}\/-[\d]{1,}\/-[\d]{1,}[\s]?){3,})+)/;
    /** Pattern used to detect a line(l vertex vertex) */
    SolidParser.LinePattern1 = /^l\s+(([\d]{1,}[\s]?){2,})+/;
    /** Pattern used to detect a second kind of line (l vertex/uvs vertex/uvs) */
    SolidParser.LinePattern2 = /^l\s+((([\d]{1,}\/[\d]{1,}[\s]?){2,})+)/;
    /** Pattern used to detect a third kind of line (l vertex/uvs/normal vertex/uvs/normal) */
    SolidParser.LinePattern3 = /^l\s+((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){2,})+)/;
    return SolidParser;
}());


/***/ }),

/***/ "../../../lts/loaders/src/legacy/legacy-objFileLoader.ts":
/*!***************************************************************!*\
  !*** ../../../lts/loaders/src/legacy/legacy-objFileLoader.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MTLFileLoader: () => (/* reexport safe */ loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__.MTLFileLoader),
/* harmony export */   OBJFileLoader: () => (/* reexport safe */ loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__.OBJFileLoader),
/* harmony export */   SolidParser: () => (/* reexport safe */ loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__.SolidParser)
/* harmony export */ });
/* harmony import */ var loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! loaders/OBJ/index */ "../../../dev/loaders/src/OBJ/index.ts");
/* eslint-disable import/no-internal-modules */

/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
var globalObject = typeof __webpack_require__.g !== "undefined" ? __webpack_require__.g : typeof window !== "undefined" ? window : undefined;
if (typeof globalObject !== "undefined") {
    for (var key in loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__) {
        if (!globalObject.BABYLON[key]) {
            globalObject.BABYLON[key] = loaders_OBJ_index__WEBPACK_IMPORTED_MODULE_0__[key];
        }
    }
}



/***/ }),

/***/ "babylonjs/Misc/observable":
/*!****************************************************************************************************!*\
  !*** external {"root":"BABYLON","commonjs":"babylonjs","commonjs2":"babylonjs","amd":"babylonjs"} ***!
  \****************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_babylonjs_Misc_observable__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/objFileLoader.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   loaders: () => (/* reexport module object */ _lts_loaders_legacy_legacy_objFileLoader__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _lts_loaders_legacy_legacy_objFileLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lts/loaders/legacy/legacy-objFileLoader */ "../../../lts/loaders/src/legacy/legacy-objFileLoader.ts");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lts_loaders_legacy_legacy_objFileLoader__WEBPACK_IMPORTED_MODULE_0__);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFieWxvbi5vYmpGaWxlTG9hZGVyLmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRkE7QUFDQTtBQUNBO0FBSUE7O0FBRUE7QUFDQTtBQUFBO0FBTUE7O0FBRUE7QUFDQTtBQStNQTtBQTdNQTs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7Ozs7OztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBdE5BOztBQUVBO0FBQ0E7QUFvTkE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pPQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBRUE7QUFHQTs7O0FBR0E7QUFDQTtBQTZEQTs7OztBQUlBO0FBQ0E7QUFsQkE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQVVBO0FBQ0E7QUF4REE7QUFIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7O0FBSkE7QUF3REE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBQTtBQUVBOzs7Ozs7Ozs7O0FBVUE7QUFDQTtBQU1BO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7O0FBTUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7QUFTQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBMVNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBWUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBNlBBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsVUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFrQkE7O0FBRUE7QUFDQTtBQWlFQTs7Ozs7QUFLQTtBQUNBO0FBakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7O0FBYUE7QUFDQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7Ozs7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQU9BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7O0FBT0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBLzBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTh5QkE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDLzJCQTtBQUNBO0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7Ozs7OztBQ2hCQTs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTE9BREVSUy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vTE9BREVSUy8uLi8uLi8uLi9kZXYvbG9hZGVycy9zcmMvT0JKL2luZGV4LnRzIiwid2VicGFjazovL0xPQURFUlMvLi4vLi4vLi4vZGV2L2xvYWRlcnMvc3JjL09CSi9tdGxGaWxlTG9hZGVyLnRzIiwid2VicGFjazovL0xPQURFUlMvLi4vLi4vLi4vZGV2L2xvYWRlcnMvc3JjL09CSi9vYmpGaWxlTG9hZGVyLnRzIiwid2VicGFjazovL0xPQURFUlMvLi4vLi4vLi4vZGV2L2xvYWRlcnMvc3JjL09CSi9zb2xpZFBhcnNlci50cyIsIndlYnBhY2s6Ly9MT0FERVJTLy4uLy4uLy4uL2x0cy9sb2FkZXJzL3NyYy9sZWdhY3kvbGVnYWN5LW9iakZpbGVMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vTE9BREVSUy9leHRlcm5hbCB1bWQge1wicm9vdFwiOlwiQkFCWUxPTlwiLFwiY29tbW9uanNcIjpcImJhYnlsb25qc1wiLFwiY29tbW9uanMyXCI6XCJiYWJ5bG9uanNcIixcImFtZFwiOlwiYmFieWxvbmpzXCJ9Iiwid2VicGFjazovL0xPQURFUlMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTE9BREVSUy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9MT0FERVJTL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9MT0FERVJTL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vTE9BREVSUy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0xPQURFUlMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9MT0FERVJTLy4vc3JjL29iakZpbGVMb2FkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYmFieWxvbmpzXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiYmFieWxvbmpzLWxvYWRlcnNcIiwgW1wiYmFieWxvbmpzXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImJhYnlsb25qcy1sb2FkZXJzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYmFieWxvbmpzXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJMT0FERVJTXCJdID0gZmFjdG9yeShyb290W1wiQkFCWUxPTlwiXSk7XG59KSgodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHRoaXMpLCAoX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9iYWJ5bG9uanNfTWlzY19vYnNlcnZhYmxlX18pID0+IHtcbnJldHVybiAiLCJleHBvcnQgKiBmcm9tIFwiLi9tdGxGaWxlTG9hZGVyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL29iakxvYWRpbmdPcHRpb25zXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL3NvbGlkUGFyc2VyXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL29iakZpbGVMb2FkZXJcIjtcclxuIiwiaW1wb3J0IHR5cGUgeyBOdWxsYWJsZSB9IGZyb20gXCJjb3JlL3R5cGVzXCI7XHJcbmltcG9ydCB7IENvbG9yMyB9IGZyb20gXCJjb3JlL01hdGhzL21hdGguY29sb3JcIjtcclxuaW1wb3J0IHsgVGV4dHVyZSB9IGZyb20gXCJjb3JlL01hdGVyaWFscy9UZXh0dXJlcy90ZXh0dXJlXCI7XHJcbmltcG9ydCB7IFN0YW5kYXJkTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvc3RhbmRhcmRNYXRlcmlhbFwiO1xyXG5cclxuaW1wb3J0IHR5cGUgeyBTY2VuZSB9IGZyb20gXCJjb3JlL3NjZW5lXCI7XHJcbmltcG9ydCB0eXBlIHsgQXNzZXRDb250YWluZXIgfSBmcm9tIFwiY29yZS9hc3NldENvbnRhaW5lclwiO1xyXG4vKipcclxuICogQ2xhc3MgcmVhZGluZyBhbmQgcGFyc2luZyB0aGUgTVRMIGZpbGUgYnVuZGxlZCB3aXRoIHRoZSBvYmogZmlsZS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBNVExGaWxlTG9hZGVyIHtcclxuICAgIC8qKlxyXG4gICAgICogSW52ZXJ0IFktQXhpcyBvZiByZWZlcmVuY2VkIHRleHR1cmVzIG9uIGxvYWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBJTlZFUlRfVEVYVFVSRV9ZID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCBtYXRlcmlhbCBsb2FkZWQgZnJvbSB0aGUgbXRsIHdpbGwgYmUgc2V0IGhlcmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1hdGVyaWFsczogU3RhbmRhcmRNYXRlcmlhbFtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgcmVhZCB0aGUgbXRsIGZpbGUgYW5kIGNyZWF0ZSBlYWNoIG1hdGVyaWFsIGRlc2NyaWJlZCBpbnNpZGVcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gY291bGQgYmUgaW1wcm92ZSBieSBhZGRpbmcgOlxyXG4gICAgICogLXNvbWUgY29tcG9uZW50IG1pc3NpbmcgKE5pLCBUZi4uLilcclxuICAgICAqIC1pbmNsdWRpbmcgdGhlIHNwZWNpZmljIG9wdGlvbnMgYXZhaWxhYmxlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNjZW5lIGRlZmluZXMgdGhlIHNjZW5lIHRoZSBtYXRlcmlhbCB3aWxsIGJlIGNyZWF0ZWQgaW5cclxuICAgICAqIEBwYXJhbSBkYXRhIGRlZmluZXMgdGhlIG10bCBkYXRhIHRvIHBhcnNlXHJcbiAgICAgKiBAcGFyYW0gcm9vdFVybCBkZWZpbmVzIHRoZSByb290dXJsIHRvIHVzZSBpbiBvcmRlciB0byBsb2FkIHJlbGF0aXZlIGRlcGVuZGVuY2llc1xyXG4gICAgICogQHBhcmFtIGFzc2V0Q29udGFpbmVyIGRlZmluZXMgdGhlIGFzc2V0IGNvbnRhaW5lciB0byBzdG9yZSB0aGUgbWF0ZXJpYWwgaW4gKGNhbiBiZSBudWxsKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGFyc2VNVEwoc2NlbmU6IFNjZW5lLCBkYXRhOiBzdHJpbmcgfCBBcnJheUJ1ZmZlciwgcm9vdFVybDogc3RyaW5nLCBhc3NldENvbnRhaW5lcjogTnVsbGFibGU8QXNzZXRDb250YWluZXI+KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1NwbGl0IHRoZSBsaW5lcyBmcm9tIHRoZSBmaWxlXHJcbiAgICAgICAgY29uc3QgbGluZXMgPSBkYXRhLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgIC8vIHdoaXRlc3BhY2UgY2hhciBpZTogWyBcXHRcXHJcXG5cXGZdXHJcbiAgICAgICAgY29uc3QgZGVsaW1pdGVyX3BhdHRlcm4gPSAvXFxzKy87XHJcbiAgICAgICAgLy9BcnJheSB3aXRoIFJHQiBjb2xvcnNcclxuICAgICAgICBsZXQgY29sb3I6IG51bWJlcltdO1xyXG4gICAgICAgIC8vTmV3IG1hdGVyaWFsXHJcbiAgICAgICAgbGV0IG1hdGVyaWFsOiBOdWxsYWJsZTxTdGFuZGFyZE1hdGVyaWFsPiA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vTG9vayBhdCBlYWNoIGxpbmVcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBCbGFuayBsaW5lIG9yIGNvbW1lbnRcclxuICAgICAgICAgICAgaWYgKGxpbmUubGVuZ3RoID09PSAwIHx8IGxpbmUuY2hhckF0KDApID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vR2V0IHRoZSBmaXJzdCBwYXJhbWV0ZXIgKGtleXdvcmQpXHJcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGxpbmUuaW5kZXhPZihcIiBcIik7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBwb3MgPj0gMCA/IGxpbmUuc3Vic3RyaW5nKDAsIHBvcykgOiBsaW5lO1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIC8vR2V0IHRoZSBkYXRhIGZvbGxvd2luZyB0aGUga2V5XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBwb3MgPj0gMCA/IGxpbmUuc3Vic3RyaW5nKHBvcyArIDEpLnRyaW0oKSA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvL1RoaXMgbXRsIGtleXdvcmQgd2lsbCBjcmVhdGUgdGhlIG5ldyBtYXRlcmlhbFxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBcIm5ld210bFwiKSB7XHJcbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGl0IGlzIHRoZSBmaXJzdCBtYXRlcmlhbC5cclxuICAgICAgICAgICAgICAgIC8vIE1hdGVyaWFscyBzcGVjaWZpY2F0aW9ucyBhcmUgZGVzY3JpYmVkIGFmdGVyIHRoaXMga2V5d29yZC5cclxuICAgICAgICAgICAgICAgIGlmIChtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQWRkIHRoZSBwcmV2aW91cyBtYXRlcmlhbCBpbiB0aGUgbWF0ZXJpYWwgYXJyYXkuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRlcmlhbHMucHVzaChtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL0NyZWF0ZSBhIG5ldyBtYXRlcmlhbC5cclxuICAgICAgICAgICAgICAgIC8vIHZhbHVlIGlzIHRoZSBuYW1lIG9mIHRoZSBtYXRlcmlhbCByZWFkIGluIHRoZSBtdGwgZmlsZVxyXG5cclxuICAgICAgICAgICAgICAgIHNjZW5lLl9ibG9ja0VudGl0eUNvbGxlY3Rpb24gPSAhIWFzc2V0Q29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwgPSBuZXcgU3RhbmRhcmRNYXRlcmlhbCh2YWx1ZSwgc2NlbmUpO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuX3BhcmVudENvbnRhaW5lciA9IGFzc2V0Q29udGFpbmVyO1xyXG4gICAgICAgICAgICAgICAgc2NlbmUuX2Jsb2NrRW50aXR5Q29sbGVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJrZFwiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEaWZmdXNlIGNvbG9yIChjb2xvciB1bmRlciB3aGl0ZSBsaWdodCkgdXNpbmcgUkdCIHZhbHVlc1xyXG5cclxuICAgICAgICAgICAgICAgIC8vdmFsdWUgID0gXCJyIGcgYlwiXHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IDxudW1iZXJbXT52YWx1ZS5zcGxpdChkZWxpbWl0ZXJfcGF0dGVybiwgMykubWFwKHBhcnNlRmxvYXQpO1xyXG4gICAgICAgICAgICAgICAgLy9jb2xvciA9IFtyLGcsYl1cclxuICAgICAgICAgICAgICAgIC8vU2V0IHRnaGUgY29sb3IgaW50byB0aGUgbWF0ZXJpYWxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2VDb2xvciA9IENvbG9yMy5Gcm9tQXJyYXkoY29sb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJrYVwiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBbWJpZW50IGNvbG9yIChjb2xvciB1bmRlciBzaGFkb3cpIHVzaW5nIFJHQiB2YWx1ZXNcclxuXHJcbiAgICAgICAgICAgICAgICAvL3ZhbHVlID0gXCJyIGcgYlwiXHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IDxudW1iZXJbXT52YWx1ZS5zcGxpdChkZWxpbWl0ZXJfcGF0dGVybiwgMykubWFwKHBhcnNlRmxvYXQpO1xyXG4gICAgICAgICAgICAgICAgLy9jb2xvciA9IFtyLGcsYl1cclxuICAgICAgICAgICAgICAgIC8vU2V0IHRnaGUgY29sb3IgaW50byB0aGUgbWF0ZXJpYWxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFtYmllbnRDb2xvciA9IENvbG9yMy5Gcm9tQXJyYXkoY29sb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJrc1wiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjdWxhciBjb2xvciAoY29sb3Igd2hlbiBsaWdodCBpcyByZWZsZWN0ZWQgZnJvbSBzaGlueSBzdXJmYWNlKSB1c2luZyBSR0IgdmFsdWVzXHJcblxyXG4gICAgICAgICAgICAgICAgLy92YWx1ZSA9IFwiciBnIGJcIlxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSA8bnVtYmVyW10+dmFsdWUuc3BsaXQoZGVsaW1pdGVyX3BhdHRlcm4sIDMpLm1hcChwYXJzZUZsb2F0KTtcclxuICAgICAgICAgICAgICAgIC8vY29sb3IgPSBbcixnLGJdXHJcbiAgICAgICAgICAgICAgICAvL1NldCB0aGUgY29sb3IgaW50byB0aGUgbWF0ZXJpYWxcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyQ29sb3IgPSBDb2xvcjMuRnJvbUFycmF5KGNvbG9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwia2VcIiAmJiBtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRW1pc3NpdmUgY29sb3IgdXNpbmcgUkdCIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgY29sb3IgPSB2YWx1ZS5zcGxpdChkZWxpbWl0ZXJfcGF0dGVybiwgMykubWFwKHBhcnNlRmxvYXQpO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZW1pc3NpdmVDb2xvciA9IENvbG9yMy5Gcm9tQXJyYXkoY29sb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJuc1wiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvL3ZhbHVlID0gXCJJbnRlZ2VyXCJcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyUG93ZXIgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwiZFwiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvL2QgaXMgZGlzc29sdmUgZm9yIGN1cnJlbnQgbWF0ZXJpYWwuIEl0IG1lYW4gYWxwaGEgZm9yIEJBQllMT05cclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmFscGhhID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9UZXh0dXJlXHJcbiAgICAgICAgICAgICAgICAvL1RoaXMgcGFydCBjYW4gYmUgaW1wcm92ZWQgYnkgYWRkaW5nIHRoZSBwb3NzaWJsZSBvcHRpb25zIG9mIHRleHR1cmVcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibWFwX2thXCIgJiYgbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFtYmllbnQgdGV4dHVyZSBtYXAgd2l0aCBhIGxvYWRlZCBpbWFnZVxyXG4gICAgICAgICAgICAgICAgLy9XZSBtdXN0IGZpcnN0IGdldCB0aGUgZm9sZGVyIG9mIHRoZSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuYW1iaWVudFRleHR1cmUgPSBNVExGaWxlTG9hZGVyLl9HZXRUZXh0dXJlKHJvb3RVcmwsIHZhbHVlLCBzY2VuZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIm1hcF9rZFwiICYmIG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBEaWZmdXNlIHRleHR1cmUgbWFwIHdpdGggYSBsb2FkZWQgaW1hZ2VcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2VUZXh0dXJlID0gTVRMRmlsZUxvYWRlci5fR2V0VGV4dHVyZShyb290VXJsLCB2YWx1ZSwgc2NlbmUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJtYXBfa3NcIiAmJiBtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU3BlY3VsYXIgdGV4dHVyZSBtYXAgd2l0aCBhIGxvYWRlZCBpbWFnZVxyXG4gICAgICAgICAgICAgICAgLy9XZSBtdXN0IGZpcnN0IGdldCB0aGUgZm9sZGVyIG9mIHRoZSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuc3BlY3VsYXJUZXh0dXJlID0gTVRMRmlsZUxvYWRlci5fR2V0VGV4dHVyZShyb290VXJsLCB2YWx1ZSwgc2NlbmUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJtYXBfbnNcIikge1xyXG4gICAgICAgICAgICAgICAgLy9TcGVjdWxhclxyXG4gICAgICAgICAgICAgICAgLy9TcGVjdWxhciBoaWdobGlnaHQgY29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICAvL1dlIG11c3QgZmlyc3QgZ2V0IHRoZSBmb2xkZXIgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy9Ob3Qgc3VwcG9ydGVkIGJ5IEJBQllMT05cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibWFwX2J1bXBcIiAmJiBtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgLy9UaGUgYnVtcCB0ZXh0dXJlXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSB2YWx1ZS5zcGxpdChkZWxpbWl0ZXJfcGF0dGVybik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidW1wTXVsdGlwbGllckluZGV4ID0gdmFsdWVzLmluZGV4T2YoXCItYm1cIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgYnVtcE11bHRpcGxpZXI6IE51bGxhYmxlPHN0cmluZz4gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChidW1wTXVsdGlwbGllckluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBidW1wTXVsdGlwbGllciA9IHZhbHVlc1tidW1wTXVsdGlwbGllckluZGV4ICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnNwbGljZShidW1wTXVsdGlwbGllckluZGV4LCAyKTsgLy8gcmVtb3ZlXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuYnVtcFRleHR1cmUgPSBNVExGaWxlTG9hZGVyLl9HZXRUZXh0dXJlKHJvb3RVcmwsIHZhbHVlcy5qb2luKFwiIFwiKSwgc2NlbmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFsLmJ1bXBUZXh0dXJlICYmIGJ1bXBNdWx0aXBsaWVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuYnVtcFRleHR1cmUubGV2ZWwgPSBwYXJzZUZsb2F0KGJ1bXBNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibWFwX2RcIiAmJiBtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIGRpc3NvbHZlIG9mIHRoZSBtYXRlcmlhbFxyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwub3BhY2l0eVRleHR1cmUgPSBNVExGaWxlTG9hZGVyLl9HZXRUZXh0dXJlKHJvb3RVcmwsIHZhbHVlLCBzY2VuZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9PcHRpb25zIGZvciBpbGx1bWluYXRpb25cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwiaWxsdW1cIikge1xyXG4gICAgICAgICAgICAgICAgLy9JbGx1bWluYXRpb25cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1RoYXQgbWVhbiBLZCA9PSBLZFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbG9yIG9uIGFuZCBBbWJpZW50IG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vSGlnaGxpZ2h0IG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUmVmbGVjdGlvbiBvbiBhbmQgUmF5IHRyYWNlIG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVHJhbnNwYXJlbmN5OiBHbGFzcyBvbiwgUmVmbGVjdGlvbjogUmF5IHRyYWNlIG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUmVmbGVjdGlvbjogRnJlc25lbCBvbiBhbmQgUmF5IHRyYWNlIG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjZcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVHJhbnNwYXJlbmN5OiBSZWZyYWN0aW9uIG9uLCBSZWZsZWN0aW9uOiBGcmVzbmVsIG9mZiBhbmQgUmF5IHRyYWNlIG9uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVHJhbnNwYXJlbmN5OiBSZWZyYWN0aW9uIG9uLCBSZWZsZWN0aW9uOiBGcmVzbmVsIG9uIGFuZCBSYXkgdHJhY2Ugb25cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IFwiOFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9SZWZsZWN0aW9uIG9uIGFuZCBSYXkgdHJhY2Ugb2ZmXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcIjlcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVHJhbnNwYXJlbmN5OiBHbGFzcyBvbiwgUmVmbGVjdGlvbjogUmF5IHRyYWNlIG9mZlxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gXCIxMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9DYXN0cyBzaGFkb3dzIG9udG8gaW52aXNpYmxlIHN1cmZhY2VzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlVuaGFuZGxlZCBleHByZXNzaW9uIGF0IGxpbmUgOiBcIiArIGkgKydcXG4nICsgXCJ3aXRoIHZhbHVlIDogXCIgKyBsaW5lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0F0IHRoZSBlbmQgb2YgdGhlIGZpbGUsIGFkZCB0aGUgbGFzdCBtYXRlcmlhbFxyXG4gICAgICAgIGlmIChtYXRlcmlhbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hdGVyaWFscy5wdXNoKG1hdGVyaWFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIHRoZSB0ZXh0dXJlIGZvciB0aGUgbWF0ZXJpYWwuXHJcbiAgICAgKlxyXG4gICAgICogSWYgdGhlIG1hdGVyaWFsIGlzIGltcG9ydGVkIGZyb20gaW5wdXQgZmlsZSxcclxuICAgICAqIFdlIHNhbml0aXplIHRoZSB1cmwgdG8gZW5zdXJlIGl0IHRha2VzIHRoZSB0ZXh0dXJlIGZyb20gYXNpZGUgdGhlIG1hdGVyaWFsLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb290VXJsIFRoZSByb290IHVybCB0byBsb2FkIGZyb21cclxuICAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgc3RvcmVkIGluIHRoZSBtdGxcclxuICAgICAqIEBwYXJhbSBzY2VuZVxyXG4gICAgICogQHJldHVybnMgVGhlIFRleHR1cmVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX0dldFRleHR1cmUocm9vdFVybDogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBzY2VuZTogU2NlbmUpOiBOdWxsYWJsZTxUZXh0dXJlPiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSByb290VXJsO1xyXG4gICAgICAgIC8vIExvYWQgZnJvbSBpbnB1dCBmaWxlLlxyXG4gICAgICAgIGlmIChyb290VXJsID09PSBcImZpbGU6XCIpIHtcclxuICAgICAgICAgICAgbGV0IGxhc3REZWxpbWl0ZXIgPSB2YWx1ZS5sYXN0SW5kZXhPZihcIlxcXFxcIik7XHJcbiAgICAgICAgICAgIGlmIChsYXN0RGVsaW1pdGVyID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgbGFzdERlbGltaXRlciA9IHZhbHVlLmxhc3RJbmRleE9mKFwiL1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGxhc3REZWxpbWl0ZXIgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdXJsICs9IHZhbHVlLnN1YnN0cihsYXN0RGVsaW1pdGVyICsgMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB1cmwgKz0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTm90IGZyb20gaW5wdXQgZmlsZS5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdXJsICs9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0dXJlKHVybCwgc2NlbmUsIGZhbHNlLCBNVExGaWxlTG9hZGVyLklOVkVSVF9URVhUVVJFX1kpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgTnVsbGFibGUgfSBmcm9tIFwiY29yZS90eXBlc1wiO1xyXG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcImNvcmUvTWF0aHMvbWF0aC52ZWN0b3JcIjtcclxuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiY29yZS9NaXNjL3Rvb2xzXCI7XHJcbmltcG9ydCB0eXBlIHsgQWJzdHJhY3RNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL2Fic3RyYWN0TWVzaFwiO1xyXG5pbXBvcnQgdHlwZSB7IElTY2VuZUxvYWRlclBsdWdpbkFzeW5jLCBJU2NlbmVMb2FkZXJQbHVnaW5GYWN0b3J5LCBJU2NlbmVMb2FkZXJQbHVnaW4sIElTY2VuZUxvYWRlckFzeW5jUmVzdWx0IH0gZnJvbSBcImNvcmUvTG9hZGluZy9zY2VuZUxvYWRlclwiO1xyXG5pbXBvcnQgeyBTY2VuZUxvYWRlciB9IGZyb20gXCJjb3JlL0xvYWRpbmcvc2NlbmVMb2FkZXJcIjtcclxuaW1wb3J0IHsgQXNzZXRDb250YWluZXIgfSBmcm9tIFwiY29yZS9hc3NldENvbnRhaW5lclwiO1xyXG5pbXBvcnQgdHlwZSB7IFNjZW5lIH0gZnJvbSBcImNvcmUvc2NlbmVcIjtcclxuaW1wb3J0IHR5cGUgeyBXZWJSZXF1ZXN0IH0gZnJvbSBcImNvcmUvTWlzYy93ZWJSZXF1ZXN0XCI7XHJcbmltcG9ydCB7IE1UTEZpbGVMb2FkZXIgfSBmcm9tIFwiLi9tdGxGaWxlTG9hZGVyXCI7XHJcbmltcG9ydCB0eXBlIHsgT0JKTG9hZGluZ09wdGlvbnMgfSBmcm9tIFwiLi9vYmpMb2FkaW5nT3B0aW9uc1wiO1xyXG5pbXBvcnQgeyBTb2xpZFBhcnNlciB9IGZyb20gXCIuL3NvbGlkUGFyc2VyXCI7XHJcbmltcG9ydCB0eXBlIHsgTWVzaCB9IGZyb20gXCJjb3JlL01lc2hlcy9tZXNoXCI7XHJcblxyXG4vKipcclxuICogT0JKIGZpbGUgdHlwZSBsb2FkZXIuXHJcbiAqIFRoaXMgaXMgYSBiYWJ5bG9uIHNjZW5lIGxvYWRlciBwbHVnaW4uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgT0JKRmlsZUxvYWRlciBpbXBsZW1lbnRzIElTY2VuZUxvYWRlclBsdWdpbkFzeW5jLCBJU2NlbmVMb2FkZXJQbHVnaW5GYWN0b3J5IHtcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyBpZiBVVnMgYXJlIG9wdGltaXplZCBieSBkZWZhdWx0IGR1cmluZyBsb2FkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE9QVElNSVpFX1dJVEhfVVYgPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZlcnQgbW9kZWwgb24geS1heGlzIChkb2VzIGEgbW9kZWwgc2NhbGluZyBpbnZlcnNpb24pXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgSU5WRVJUX1kgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogSW52ZXJ0IFktQXhpcyBvZiByZWZlcmVuY2VkIHRleHR1cmVzIG9uIGxvYWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgSU5WRVJUX1RFWFRVUkVfWSgpIHtcclxuICAgICAgICByZXR1cm4gTVRMRmlsZUxvYWRlci5JTlZFUlRfVEVYVFVSRV9ZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IElOVkVSVF9URVhUVVJFX1kodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBNVExGaWxlTG9hZGVyLklOVkVSVF9URVhUVVJFX1kgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluY2x1ZGUgaW4gbWVzaGVzIHRoZSB2ZXJ0ZXggY29sb3JzIGF2YWlsYWJsZSBpbiBzb21lIE9CSiBmaWxlcy4gIFRoaXMgaXMgbm90IHBhcnQgb2YgT0JKIHN0YW5kYXJkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIElNUE9SVF9WRVJURVhfQ09MT1JTID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIENvbXB1dGUgdGhlIG5vcm1hbHMgZm9yIHRoZSBtb2RlbCwgZXZlbiBpZiBub3JtYWxzIGFyZSBwcmVzZW50IGluIHRoZSBmaWxlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIENPTVBVVEVfTk9STUFMUyA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBPcHRpbWl6ZSB0aGUgbm9ybWFscyBmb3IgdGhlIG1vZGVsLiBMaWdodGluZyBjYW4gYmUgdW5ldmVuIGlmIHlvdSB1c2UgT3B0aW1pemVXaXRoVVYgPSB0cnVlIGJlY2F1c2UgbmV3IHZlcnRpY2VzIGNhbiBiZSBjcmVhdGVkIGZvciB0aGUgc2FtZSBsb2NhdGlvbiBpZiB0aGV5IHBlcnRhaW4gdG8gZGlmZmVyZW50IGZhY2VzLlxyXG4gICAgICogVXNpbmcgT3B0aW1pemVoTm9ybWFscyA9IHRydWUgd2lsbCBoZWxwIHNtb290aGluZyB0aGUgbGlnaHRpbmcgYnkgYXZlcmFnaW5nIHRoZSBub3JtYWxzIG9mIHRob3NlIHZlcnRpY2VzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE9QVElNSVpFX05PUk1BTFMgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyBjdXN0b20gc2NhbGluZyBvZiBVViBjb29yZGluYXRlcyBvZiBsb2FkZWQgbWVzaGVzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFVWX1NDQUxJTkcgPSBuZXcgVmVjdG9yMigxLCAxKTtcclxuICAgIC8qKlxyXG4gICAgICogU2tpcCBsb2FkaW5nIHRoZSBtYXRlcmlhbHMgZXZlbiBpZiBkZWZpbmVkIGluIHRoZSBPQkogZmlsZSAobWF0ZXJpYWxzIGFyZSBpZ25vcmVkKS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBTS0lQX01BVEVSSUFMUyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBhIG1hdGVyaWFsIGZhaWxzIHRvIGxvYWQgT0JKIGxvYWRlciB3aWxsIHNpbGVudGx5IGZhaWwgYW5kIG9uU3VjY2VzcygpIGNhbGxiYWNrIHdpbGwgYmUgdHJpZ2dlcmVkLlxyXG4gICAgICpcclxuICAgICAqIERlZmF1bHRzIHRvIHRydWUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE1BVEVSSUFMX0xPQURJTkdfRkFJTFNfU0lMRU5UTFkgPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBwbHVnaW4uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBuYW1lID0gXCJvYmpcIjtcclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyB0aGUgZXh0ZW5zaW9uIHRoZSBwbHVnaW4gaXMgYWJsZSB0byBsb2FkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXh0ZW5zaW9ucyA9IFwiLm9ialwiO1xyXG5cclxuICAgIHByaXZhdGUgX2Fzc2V0Q29udGFpbmVyOiBOdWxsYWJsZTxBc3NldENvbnRhaW5lcj4gPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX2xvYWRpbmdPcHRpb25zOiBPQkpMb2FkaW5nT3B0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgbG9hZGVyIGZvciAuT0JKIGZpbGVzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGxvYWRpbmdPcHRpb25zIG9wdGlvbnMgZm9yIGxvYWRpbmcgYW5kIHBhcnNpbmcgT0JKL01UTCBmaWxlcy5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobG9hZGluZ09wdGlvbnM/OiBPQkpMb2FkaW5nT3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX2xvYWRpbmdPcHRpb25zID0gbG9hZGluZ09wdGlvbnMgfHwgT0JKRmlsZUxvYWRlci5fRGVmYXVsdExvYWRpbmdPcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldCBfRGVmYXVsdExvYWRpbmdPcHRpb25zKCk6IE9CSkxvYWRpbmdPcHRpb25zIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjb21wdXRlTm9ybWFsczogT0JKRmlsZUxvYWRlci5DT01QVVRFX05PUk1BTFMsXHJcbiAgICAgICAgICAgIG9wdGltaXplTm9ybWFsczogT0JKRmlsZUxvYWRlci5PUFRJTUlaRV9OT1JNQUxTLFxyXG4gICAgICAgICAgICBpbXBvcnRWZXJ0ZXhDb2xvcnM6IE9CSkZpbGVMb2FkZXIuSU1QT1JUX1ZFUlRFWF9DT0xPUlMsXHJcbiAgICAgICAgICAgIGludmVydFk6IE9CSkZpbGVMb2FkZXIuSU5WRVJUX1ksXHJcbiAgICAgICAgICAgIGludmVydFRleHR1cmVZOiBPQkpGaWxlTG9hZGVyLklOVkVSVF9URVhUVVJFX1ksXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cclxuICAgICAgICAgICAgVVZTY2FsaW5nOiBPQkpGaWxlTG9hZGVyLlVWX1NDQUxJTkcsXHJcbiAgICAgICAgICAgIG1hdGVyaWFsTG9hZGluZ0ZhaWxzU2lsZW50bHk6IE9CSkZpbGVMb2FkZXIuTUFURVJJQUxfTE9BRElOR19GQUlMU19TSUxFTlRMWSxcclxuICAgICAgICAgICAgb3B0aW1pemVXaXRoVVY6IE9CSkZpbGVMb2FkZXIuT1BUSU1JWkVfV0lUSF9VVixcclxuICAgICAgICAgICAgc2tpcE1hdGVyaWFsczogT0JKRmlsZUxvYWRlci5TS0lQX01BVEVSSUFMUyxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbHMgc3luY2hyb25vdXNseSB0aGUgTVRMIGZpbGUgYXR0YWNoZWQgdG8gdGhpcyBvYmouXHJcbiAgICAgKiBMb2FkIGZ1bmN0aW9uIG9yIGltcG9ydE1lc2ggZnVuY3Rpb24gZG9uJ3QgZW5hYmxlIHRvIGxvYWQgMiBmaWxlcyBpbiB0aGUgc2FtZSB0aW1lIGFzeW5jaHJvbm91c2x5LlxyXG4gICAgICogV2l0aG91dCB0aGlzIGZ1bmN0aW9uIG1hdGVyaWFscyBhcmUgbm90IGRpc3BsYXllZCBpbiB0aGUgZmlyc3QgZnJhbWUgKGJ1dCBkaXNwbGF5ZWQgYWZ0ZXIpLlxyXG4gICAgICogSW4gY29uc2VxdWVuY2UgaXQgaXMgaW1wb3NzaWJsZSB0byBnZXQgbWF0ZXJpYWwgaW5mb3JtYXRpb24gaW4geW91ciBIVE1MIGZpbGVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBVUkwgb2YgdGhlIE1UTCBmaWxlXHJcbiAgICAgKiBAcGFyYW0gcm9vdFVybCBkZWZpbmVzIHdoZXJlIHRvIGxvYWQgZGF0YSBmcm9tXHJcbiAgICAgKiBAcGFyYW0gb25TdWNjZXNzIENhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBNVEwgZmlsZSBpcyBsb2FkZWRcclxuICAgICAqIEBwYXJhbSBvbkZhaWx1cmVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbG9hZE1UTChcclxuICAgICAgICB1cmw6IHN0cmluZyxcclxuICAgICAgICByb290VXJsOiBzdHJpbmcsXHJcbiAgICAgICAgb25TdWNjZXNzOiAocmVzcG9uc2U6IHN0cmluZyB8IEFycmF5QnVmZmVyLCByZXNwb25zZVVybD86IHN0cmluZykgPT4gYW55LFxyXG4gICAgICAgIG9uRmFpbHVyZTogKHBhdGhPZkZpbGU6IHN0cmluZywgZXhjZXB0aW9uPzogYW55KSA9PiB2b2lkXHJcbiAgICApIHtcclxuICAgICAgICAvL1RoZSBjb21wbGV0ZSBwYXRoIHRvIHRoZSBtdGwgZmlsZVxyXG4gICAgICAgIGNvbnN0IHBhdGhPZkZpbGUgPSByb290VXJsICsgdXJsO1xyXG5cclxuICAgICAgICAvLyBMb2FkcyB0aHJvdWdoIHRoZSBiYWJ5bG9uIHRvb2xzIHRvIGFsbG93IGZpbGVJbnB1dCBzZWFyY2guXHJcbiAgICAgICAgVG9vbHMuTG9hZEZpbGUocGF0aE9mRmlsZSwgb25TdWNjZXNzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZmFsc2UsIChyZXF1ZXN0PzogV2ViUmVxdWVzdCB8IHVuZGVmaW5lZCwgZXhjZXB0aW9uPzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIG9uRmFpbHVyZShwYXRoT2ZGaWxlLCBleGNlcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zdGFudGlhdGVzIGEgT0JKIGZpbGUgbG9hZGVyIHBsdWdpbi5cclxuICAgICAqIEByZXR1cm5zIHRoZSBjcmVhdGVkIHBsdWdpblxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQbHVnaW4oKTogSVNjZW5lTG9hZGVyUGx1Z2luQXN5bmMgfCBJU2NlbmVMb2FkZXJQbHVnaW4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgT0JKRmlsZUxvYWRlcihPQkpGaWxlTG9hZGVyLl9EZWZhdWx0TG9hZGluZ09wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSWYgdGhlIGRhdGEgc3RyaW5nIGNhbiBiZSBsb2FkZWQgZGlyZWN0bHkuXHJcbiAgICAgKiBAcmV0dXJucyBpZiB0aGUgZGF0YSBjYW4gYmUgbG9hZGVkIGRpcmVjdGx5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYW5EaXJlY3RMb2FkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEltcG9ydHMgb25lIG9yIG1vcmUgbWVzaGVzIGZyb20gdGhlIGxvYWRlZCBPQkogZGF0YSBhbmQgYWRkcyB0aGVtIHRvIHRoZSBzY2VuZVxyXG4gICAgICogQHBhcmFtIG1lc2hlc05hbWVzIGEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3Mgb2YgdGhlIG1lc2ggbmFtZXMgdGhhdCBzaG91bGQgYmUgbG9hZGVkIGZyb20gdGhlIGZpbGVcclxuICAgICAqIEBwYXJhbSBzY2VuZSB0aGUgc2NlbmUgdGhlIG1lc2hlcyBzaG91bGQgYmUgYWRkZWQgdG9cclxuICAgICAqIEBwYXJhbSBkYXRhIHRoZSBPQkogZGF0YSB0byBsb2FkXHJcbiAgICAgKiBAcGFyYW0gcm9vdFVybCByb290IHVybCB0byBsb2FkIGZyb21cclxuICAgICAqIEByZXR1cm5zIGEgcHJvbWlzZSBjb250YWluaW5nIHRoZSBsb2FkZWQgbWVzaGVzLCBwYXJ0aWNsZXMsIHNrZWxldG9ucyBhbmQgYW5pbWF0aW9uc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW1wb3J0TWVzaEFzeW5jKG1lc2hlc05hbWVzOiBhbnksIHNjZW5lOiBTY2VuZSwgZGF0YTogYW55LCByb290VXJsOiBzdHJpbmcpOiBQcm9taXNlPElTY2VuZUxvYWRlckFzeW5jUmVzdWx0PiB7XHJcbiAgICAgICAgLy9nZXQgdGhlIG1lc2hlcyBmcm9tIE9CSiBmaWxlXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlU29saWQobWVzaGVzTmFtZXMsIHNjZW5lLCBkYXRhLCByb290VXJsKS50aGVuKChtZXNoZXMpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG1lc2hlczogbWVzaGVzLFxyXG4gICAgICAgICAgICAgICAgcGFydGljbGVTeXN0ZW1zOiBbXSxcclxuICAgICAgICAgICAgICAgIHNrZWxldG9uczogW10sXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25Hcm91cHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtTm9kZXM6IFtdLFxyXG4gICAgICAgICAgICAgICAgZ2VvbWV0cmllczogW10sXHJcbiAgICAgICAgICAgICAgICBsaWdodHM6IFtdLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW1wb3J0cyBhbGwgb2JqZWN0cyBmcm9tIHRoZSBsb2FkZWQgT0JKIGRhdGEgYW5kIGFkZHMgdGhlbSB0byB0aGUgc2NlbmVcclxuICAgICAqIEBwYXJhbSBzY2VuZSB0aGUgc2NlbmUgdGhlIG9iamVjdHMgc2hvdWxkIGJlIGFkZGVkIHRvXHJcbiAgICAgKiBAcGFyYW0gZGF0YSB0aGUgT0JKIGRhdGEgdG8gbG9hZFxyXG4gICAgICogQHBhcmFtIHJvb3RVcmwgcm9vdCB1cmwgdG8gbG9hZCBmcm9tXHJcbiAgICAgKiBAcmV0dXJucyBhIHByb21pc2Ugd2hpY2ggY29tcGxldGVzIHdoZW4gb2JqZWN0cyBoYXZlIGJlZW4gbG9hZGVkIHRvIHRoZSBzY2VuZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZEFzeW5jKHNjZW5lOiBTY2VuZSwgZGF0YTogc3RyaW5nLCByb290VXJsOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAvL0dldCB0aGUgM0QgbW9kZWxcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBvcnRNZXNoQXN5bmMobnVsbCwgc2NlbmUsIGRhdGEsIHJvb3RVcmwpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdm9pZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTG9hZCBpbnRvIGFuIGFzc2V0IGNvbnRhaW5lci5cclxuICAgICAqIEBwYXJhbSBzY2VuZSBUaGUgc2NlbmUgdG8gbG9hZCBpbnRvXHJcbiAgICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBpbXBvcnRcclxuICAgICAqIEBwYXJhbSByb290VXJsIFRoZSByb290IHVybCBmb3Igc2NlbmUgYW5kIHJlc291cmNlc1xyXG4gICAgICogQHJldHVybnMgVGhlIGxvYWRlZCBhc3NldCBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvYWRBc3NldENvbnRhaW5lckFzeW5jKHNjZW5lOiBTY2VuZSwgZGF0YTogc3RyaW5nLCByb290VXJsOiBzdHJpbmcpOiBQcm9taXNlPEFzc2V0Q29udGFpbmVyPiB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gbmV3IEFzc2V0Q29udGFpbmVyKHNjZW5lKTtcclxuICAgICAgICB0aGlzLl9hc3NldENvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1wb3J0TWVzaEFzeW5jKG51bGwsIHNjZW5lLCBkYXRhLCByb290VXJsKVxyXG4gICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQubWVzaGVzLmZvckVhY2goKG1lc2gpID0+IGNvbnRhaW5lci5tZXNoZXMucHVzaChtZXNoKSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQubWVzaGVzLmZvckVhY2goKG1lc2gpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG1lc2gubWF0ZXJpYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hdGVyaWFsc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyLm1hdGVyaWFscy5pbmRleE9mKG1hdGVyaWFsKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLm1hdGVyaWFscy5wdXNoKG1hdGVyaWFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUZXh0dXJlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZXMgPSBtYXRlcmlhbC5nZXRBY3RpdmVUZXh0dXJlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dHVyZXMuZm9yRWFjaCgodCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250YWluZXIudGV4dHVyZXMuaW5kZXhPZih0KSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIudGV4dHVyZXMucHVzaCh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXNzZXRDb250YWluZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXNzZXRDb250YWluZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXg7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVhZCB0aGUgT0JKIGZpbGUgYW5kIGNyZWF0ZSBhbiBBcnJheSBvZiBtZXNoZXMuXHJcbiAgICAgKiBFYWNoIG1lc2ggY29udGFpbnMgYWxsIGluZm9ybWF0aW9uIGdpdmVuIGJ5IHRoZSBPQkogYW5kIHRoZSBNVEwgZmlsZS5cclxuICAgICAqIGkuZS4gdmVydGljZXMgcG9zaXRpb25zIGFuZCBpbmRpY2VzLCBvcHRpb25hbCBub3JtYWxzIHZhbHVlcywgb3B0aW9uYWwgVVYgdmFsdWVzLCBvcHRpb25hbCBtYXRlcmlhbFxyXG4gICAgICogQHBhcmFtIG1lc2hlc05hbWVzIGRlZmluZXMgYSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyBvZiB0aGUgbWVzaCBuYW1lcyB0aGF0IHNob3VsZCBiZSBsb2FkZWQgZnJvbSB0aGUgZmlsZVxyXG4gICAgICogQHBhcmFtIHNjZW5lIGRlZmluZXMgdGhlIHNjZW5lIHdoZXJlIGFyZSBkaXNwbGF5ZWQgdGhlIGRhdGFcclxuICAgICAqIEBwYXJhbSBkYXRhIGRlZmluZXMgdGhlIGNvbnRlbnQgb2YgdGhlIG9iaiBmaWxlXHJcbiAgICAgKiBAcGFyYW0gcm9vdFVybCBkZWZpbmVzIHRoZSBwYXRoIHRvIHRoZSBmb2xkZXJcclxuICAgICAqIEByZXR1cm5zIHRoZSBsaXN0IG9mIGxvYWRlZCBtZXNoZXNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfcGFyc2VTb2xpZChtZXNoZXNOYW1lczogYW55LCBzY2VuZTogU2NlbmUsIGRhdGE6IHN0cmluZywgcm9vdFVybDogc3RyaW5nKTogUHJvbWlzZTxBcnJheTxBYnN0cmFjdE1lc2g+PiB7XHJcbiAgICAgICAgbGV0IGZpbGVUb0xvYWQ6IHN0cmluZyA9IFwiXCI7IC8vVGhlIG5hbWUgb2YgdGhlIG10bEZpbGUgdG8gbG9hZFxyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsc0Zyb21NVExGaWxlOiBNVExGaWxlTG9hZGVyID0gbmV3IE1UTEZpbGVMb2FkZXIoKTtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbFRvVXNlOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGJhYnlsb25NZXNoZXNBcnJheTogQXJyYXk8TWVzaD4gPSBbXTsgLy9UaGUgbWVzaCBmb3IgYmFieWxvblxyXG5cclxuICAgICAgICAvLyBNYWluIGZ1bmN0aW9uXHJcbiAgICAgICAgY29uc3Qgc29saWRQYXJzZXIgPSBuZXcgU29saWRQYXJzZXIobWF0ZXJpYWxUb1VzZSwgYmFieWxvbk1lc2hlc0FycmF5LCB0aGlzLl9sb2FkaW5nT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHNvbGlkUGFyc2VyLnBhcnNlKG1lc2hlc05hbWVzLCBkYXRhLCBzY2VuZSwgdGhpcy5fYXNzZXRDb250YWluZXIsIChmaWxlTmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGZpbGVUb0xvYWQgPSBmaWxlTmFtZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbG9hZCB0aGUgbWF0ZXJpYWxzXHJcbiAgICAgICAgY29uc3QgbXRsUHJvbWlzZXM6IEFycmF5PFByb21pc2U8dm9pZD4+ID0gW107XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgaGF2ZSBhIGZpbGUgdG8gbG9hZFxyXG4gICAgICAgIGlmIChmaWxlVG9Mb2FkICE9PSBcIlwiICYmICF0aGlzLl9sb2FkaW5nT3B0aW9ucy5za2lwTWF0ZXJpYWxzKSB7XHJcbiAgICAgICAgICAgIC8vTG9hZCB0aGUgZmlsZSBzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgICAgIG10bFByb21pc2VzLnB1c2goXHJcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZE1UTChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVRvTG9hZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGFMb2FkZWQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DcmVhdGUgbWF0ZXJpYWxzIHRoYW5rcyBNVExMb2FkZXIgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbHNGcm9tTVRMRmlsZS5wYXJzZU1UTChzY2VuZSwgZGF0YUxvYWRlZCwgcm9vdFVybCwgdGhpcy5fYXNzZXRDb250YWluZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTG9vayBhdCBlYWNoIG1hdGVyaWFsIGxvYWRlZCBpbiB0aGUgbXRsIGZpbGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IG1hdGVyaWFsc0Zyb21NVExGaWxlLm1hdGVyaWFscy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RocmVlIHZhcmlhYmxlcyB0byBnZXQgYWxsIG1lc2hlcyB3aXRoIHRoZSBzYW1lIG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2luZGljZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IF9pbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhlIG1hdGVyaWFsIGZyb20gTVRMIGZpbGUgaXMgdXNlZCBpbiB0aGUgbWVzaGVzIGxvYWRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1B1c2ggdGhlIGluZGljZSBpbiBhbiBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHRoZSBtYXRlcmlhbCBpcyBub3QgdXNlZCBmb3IgYW5vdGhlciBtZXNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICgoX2luZGV4ID0gbWF0ZXJpYWxUb1VzZS5pbmRleE9mKG1hdGVyaWFsc0Zyb21NVExGaWxlLm1hdGVyaWFsc1tuXS5uYW1lLCBzdGFydEluZGV4KSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2luZGljZXMucHVzaChfaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IF9pbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgbWF0ZXJpYWwgaXMgbm90IHVzZWQgZGlzcG9zZSBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2luZGV4ID09PSAtMSAmJiBfaW5kaWNlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIG1hdGVyaWFsIGlzIG5vdCBuZWVkZWQsIHJlbW92ZSBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxzRnJvbU1UTEZpbGUubWF0ZXJpYWxzW25dLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG8gPSAwOyBvIDwgX2luZGljZXMubGVuZ3RoOyBvKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FwcGx5IHRoZSBtYXRlcmlhbCB0byB0aGUgTWVzaCBmb3IgZWFjaCBtZXNoIHdpdGggdGhlIG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzaCA9IGJhYnlsb25NZXNoZXNBcnJheVtfaW5kaWNlc1tvXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBtYXRlcmlhbHNGcm9tTVRMRmlsZS5tYXRlcmlhbHNbbl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzaC5tYXRlcmlhbCA9IG1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1lc2guZ2V0VG90YWxJbmRpY2VzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gaW5kaWNlcywgd2UgbmVlZCB0byB0dXJuIG9uIHBvaW50IGNsb3VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLnBvaW50c0Nsb3VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvb2xzLldhcm4oYEVycm9yIHByb2Nlc3NpbmcgTVRMIGZpbGU6ICcke2ZpbGVUb0xvYWR9J2ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5tYXRlcmlhbExvYWRpbmdGYWlsc1NpbGVudGx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocGF0aE9mRmlsZTogc3RyaW5nLCBleGNlcHRpb24/OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvb2xzLldhcm4oYEVycm9yIGRvd25sb2FkaW5nIE1UTCBmaWxlOiAnJHtmaWxlVG9Mb2FkfSdgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5tYXRlcmlhbExvYWRpbmdGYWlsc1NpbGVudGx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXhjZXB0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL1JldHVybiBhbiBhcnJheSB3aXRoIGFsbCBNZXNoXHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG10bFByb21pc2VzKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGJhYnlsb25NZXNoZXNBcnJheTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuaWYgKFNjZW5lTG9hZGVyKSB7XHJcbiAgICAvL0FkZCB0aGlzIGxvYWRlciBpbnRvIHRoZSByZWdpc3RlciBwbHVnaW5cclxuICAgIFNjZW5lTG9hZGVyLlJlZ2lzdGVyUGx1Z2luKG5ldyBPQkpGaWxlTG9hZGVyKCkpO1xyXG59XHJcbiIsImltcG9ydCB0eXBlIHsgQXNzZXRDb250YWluZXIgfSBmcm9tIFwiY29yZS9hc3NldENvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBWZXJ0ZXhCdWZmZXIgfSBmcm9tIFwiY29yZS9CdWZmZXJzL2J1ZmZlclwiO1xyXG5pbXBvcnQgdHlwZSB7IE1hdGVyaWFsIH0gZnJvbSBcImNvcmUvTWF0ZXJpYWxzL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IFN0YW5kYXJkTWF0ZXJpYWwgfSBmcm9tIFwiY29yZS9NYXRlcmlhbHMvc3RhbmRhcmRNYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBDb2xvcjMsIENvbG9yNCB9IGZyb20gXCJjb3JlL01hdGhzL21hdGguY29sb3JcIjtcclxuaW1wb3J0IHsgVmVjdG9yMiwgVmVjdG9yMyB9IGZyb20gXCJjb3JlL01hdGhzL21hdGgudmVjdG9yXCI7XHJcbmltcG9ydCB0eXBlIHsgQWJzdHJhY3RNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL2Fic3RyYWN0TWVzaFwiO1xyXG5pbXBvcnQgeyBHZW9tZXRyeSB9IGZyb20gXCJjb3JlL01lc2hlcy9nZW9tZXRyeVwiO1xyXG5pbXBvcnQgeyBNZXNoIH0gZnJvbSBcImNvcmUvTWVzaGVzL21lc2hcIjtcclxuaW1wb3J0IHsgVmVydGV4RGF0YSB9IGZyb20gXCJjb3JlL01lc2hlcy9tZXNoLnZlcnRleERhdGFcIjtcclxuaW1wb3J0IHR5cGUgeyBTY2VuZSB9IGZyb20gXCJjb3JlL3NjZW5lXCI7XHJcbmltcG9ydCB0eXBlIHsgRmxvYXRBcnJheSwgSW5kaWNlc0FycmF5LCBOdWxsYWJsZSB9IGZyb20gXCJjb3JlL3R5cGVzXCI7XHJcbmltcG9ydCB0eXBlIHsgT0JKTG9hZGluZ09wdGlvbnMgfSBmcm9tIFwiLi9vYmpMb2FkaW5nT3B0aW9uc1wiO1xyXG5cclxudHlwZSBNZXNoT2JqZWN0ID0ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaW5kaWNlcz86IEFycmF5PG51bWJlcj47XHJcbiAgICBwb3NpdGlvbnM/OiBBcnJheTxudW1iZXI+O1xyXG4gICAgbm9ybWFscz86IEFycmF5PG51bWJlcj47XHJcbiAgICBjb2xvcnM/OiBBcnJheTxudW1iZXI+O1xyXG4gICAgdXZzPzogQXJyYXk8bnVtYmVyPjtcclxuICAgIG1hdGVyaWFsTmFtZTogc3RyaW5nO1xyXG4gICAgZGlyZWN0TWF0ZXJpYWw/OiBOdWxsYWJsZTxNYXRlcmlhbD47XHJcbiAgICBpc09iamVjdDogYm9vbGVhbjsgLy8gSWYgdGhlIGVudGl0eSBpcyBkZWZpbmVkIGFzIGFuIG9iamVjdCAoXCJvXCIpLCBvciBncm91cCAoXCJnXCIpXHJcbiAgICBfYmFieWxvbk1lc2g/OiBBYnN0cmFjdE1lc2g7IC8vIFRoZSBjb3JyZXNwb25kaW5nIEJhYnlsb24gbWVzaFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsYXNzIHVzZWQgdG8gbG9hZCBtZXNoIGRhdGEgZnJvbSBPQkogY29udGVudFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNvbGlkUGFyc2VyIHtcclxuICAgIC8vIERlc2NyaXB0b3JcclxuICAgIC8qKiBPYmplY3QgZGVzY3JpcHRvciAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBPYmplY3REZXNjcmlwdG9yID0gL15vLztcclxuICAgIC8qKiBHcm91cCBkZXNjcmlwdG9yICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEdyb3VwRGVzY3JpcHRvciA9IC9eZy87XHJcbiAgICAvKiogTWF0ZXJpYWwgbGliIGRlc2NyaXB0b3IgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTXRsTGliR3JvdXBEZXNjcmlwdG9yID0gL15tdGxsaWIgLztcclxuICAgIC8qKiBVc2UgYSBtYXRlcmlhbCBkZXNjcmlwdG9yICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFVzZU10bERlc2NyaXB0b3IgPSAvXnVzZW10bCAvO1xyXG4gICAgLyoqIFNtb290aCBkZXNjcmlwdG9yICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFNtb290aERlc2NyaXB0b3IgPSAvXnMgLztcclxuXHJcbiAgICAvLyBQYXR0ZXJuc1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSB2ZXJ0ZXggKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgVmVydGV4UGF0dGVybiA9IC9edihcXHMrW1xcZHwufCt8XFwtfGV8RV0rKXszLDd9LztcclxuICAgIC8qKiBQYXR0ZXJuIHVzZWQgdG8gZGV0ZWN0IGEgbm9ybWFsICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE5vcm1hbFBhdHRlcm4gPSAvXnZuKFxccytbXFxkfC58K3xcXC18ZXxFXSspKCArW1xcZHwufCt8XFwtfGV8RV0rKSggK1tcXGR8LnwrfFxcLXxlfEVdKykvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSBVViBzZXQgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgVVZQYXR0ZXJuID0gL152dChcXHMrW1xcZHwufCt8XFwtfGV8RV0rKSggK1tcXGR8LnwrfFxcLXxlfEVdKykvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSBmaXJzdCBraW5kIG9mIGZhY2UgKGYgdmVydGV4IHZlcnRleCB2ZXJ0ZXgpICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEZhY2VQYXR0ZXJuMSA9IC9eZlxccysoKFtcXGRdezEsfVtcXHNdPyl7Myx9KSsvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSBzZWNvbmQga2luZCBvZiBmYWNlIChmIHZlcnRleC91dnMgdmVydGV4L3V2cyB2ZXJ0ZXgvdXZzKSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBGYWNlUGF0dGVybjIgPSAvXmZcXHMrKCgoW1xcZF17MSx9XFwvW1xcZF17MSx9W1xcc10/KXszLH0pKykvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSB0aGlyZCBraW5kIG9mIGZhY2UgKGYgdmVydGV4L3V2cy9ub3JtYWwgdmVydGV4L3V2cy9ub3JtYWwgdmVydGV4L3V2cy9ub3JtYWwpICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEZhY2VQYXR0ZXJuMyA9IC9eZlxccysoKChbXFxkXXsxLH1cXC9bXFxkXXsxLH1cXC9bXFxkXXsxLH1bXFxzXT8pezMsfSkrKS87XHJcbiAgICAvKiogUGF0dGVybiB1c2VkIHRvIGRldGVjdCBhIGZvdXJ0aCBraW5kIG9mIGZhY2UgKGYgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwgdmVydGV4Ly9ub3JtYWwpKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgRmFjZVBhdHRlcm40ID0gL15mXFxzKygoKFtcXGRdezEsfVxcL1xcL1tcXGRdezEsfVtcXHNdPyl7Myx9KSspLztcclxuICAgIC8qKiBQYXR0ZXJuIHVzZWQgdG8gZGV0ZWN0IGEgZmlmdGgga2luZCBvZiBmYWNlIChmIC12ZXJ0ZXgvLXV2cy8tbm9ybWFsIC12ZXJ0ZXgvLXV2cy8tbm9ybWFsIC12ZXJ0ZXgvLXV2cy8tbm9ybWFsKSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBGYWNlUGF0dGVybjUgPSAvXmZcXHMrKCgoLVtcXGRdezEsfVxcLy1bXFxkXXsxLH1cXC8tW1xcZF17MSx9W1xcc10/KXszLH0pKykvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSBsaW5lKGwgdmVydGV4IHZlcnRleCkgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTGluZVBhdHRlcm4xID0gL15sXFxzKygoW1xcZF17MSx9W1xcc10/KXsyLH0pKy87XHJcbiAgICAvKiogUGF0dGVybiB1c2VkIHRvIGRldGVjdCBhIHNlY29uZCBraW5kIG9mIGxpbmUgKGwgdmVydGV4L3V2cyB2ZXJ0ZXgvdXZzKSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBMaW5lUGF0dGVybjIgPSAvXmxcXHMrKCgoW1xcZF17MSx9XFwvW1xcZF17MSx9W1xcc10/KXsyLH0pKykvO1xyXG4gICAgLyoqIFBhdHRlcm4gdXNlZCB0byBkZXRlY3QgYSB0aGlyZCBraW5kIG9mIGxpbmUgKGwgdmVydGV4L3V2cy9ub3JtYWwgdmVydGV4L3V2cy9ub3JtYWwpICovXHJcbiAgICBwdWJsaWMgc3RhdGljIExpbmVQYXR0ZXJuMyA9IC9ebFxccysoKChbXFxkXXsxLH1cXC9bXFxkXXsxLH1cXC9bXFxkXXsxLH1bXFxzXT8pezIsfSkrKS87XHJcblxyXG4gICAgcHJpdmF0ZSBfbG9hZGluZ09wdGlvbnM6IE9CSkxvYWRpbmdPcHRpb25zO1xyXG4gICAgcHJpdmF0ZSBfcG9zaXRpb25zOiBBcnJheTxWZWN0b3IzPiA9IFtdOyAvL3ZhbHVlcyBmb3IgdGhlIHBvc2l0aW9ucyBvZiB2ZXJ0aWNlc1xyXG4gICAgcHJpdmF0ZSBfbm9ybWFsczogQXJyYXk8VmVjdG9yMz4gPSBbXTsgLy9WYWx1ZXMgZm9yIHRoZSBub3JtYWxzXHJcbiAgICBwcml2YXRlIF91dnM6IEFycmF5PFZlY3RvcjI+ID0gW107IC8vVmFsdWVzIGZvciB0aGUgdGV4dHVyZXNcclxuICAgIHByaXZhdGUgX2NvbG9yczogQXJyYXk8Q29sb3I0PiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfbWVzaGVzRnJvbU9iajogQXJyYXk8TWVzaE9iamVjdD4gPSBbXTsgLy9bbWVzaF0gQ29udGFpbnMgYWxsIHRoZSBvYmogbWVzaGVzXHJcbiAgICBwcml2YXRlIF9oYW5kbGVkTWVzaDogTWVzaE9iamVjdDsgLy9UaGUgY3VycmVudCBtZXNoIG9mIG1lc2hlcyBhcnJheVxyXG4gICAgcHJpdmF0ZSBfaW5kaWNlc0ZvckJhYnlsb246IEFycmF5PG51bWJlcj4gPSBbXTsgLy9UaGUgbGlzdCBvZiBpbmRpY2VzIGZvciBWZXJ0ZXhEYXRhXHJcbiAgICBwcml2YXRlIF93cmFwcGVkUG9zaXRpb25Gb3JCYWJ5bG9uOiBBcnJheTxWZWN0b3IzPiA9IFtdOyAvL1RoZSBsaXN0IG9mIHBvc2l0aW9uIGluIHZlY3RvcnNcclxuICAgIHByaXZhdGUgX3dyYXBwZWRVdnNGb3JCYWJ5bG9uOiBBcnJheTxWZWN0b3IyPiA9IFtdOyAvL0FycmF5IHdpdGggYWxsIHZhbHVlIG9mIHV2cyB0byBtYXRjaCB3aXRoIHRoZSBpbmRpY2VzXHJcbiAgICBwcml2YXRlIF93cmFwcGVkQ29sb3JzRm9yQmFieWxvbjogQXJyYXk8Q29sb3I0PiA9IFtdOyAvLyBBcnJheSB3aXRoIGFsbCBjb2xvciB2YWx1ZXMgdG8gbWF0Y2ggd2l0aCB0aGUgaW5kaWNlc1xyXG4gICAgcHJpdmF0ZSBfd3JhcHBlZE5vcm1hbHNGb3JCYWJ5bG9uOiBBcnJheTxWZWN0b3IzPiA9IFtdOyAvL0FycmF5IHdpdGggYWxsIHZhbHVlIG9mIG5vcm1hbHMgdG8gbWF0Y2ggd2l0aCB0aGUgaW5kaWNlc1xyXG4gICAgcHJpdmF0ZSBfdHVwbGVQb3NOb3JtOiBBcnJheTx7IG5vcm1hbHM6IEFycmF5PG51bWJlcj47IGlkeDogQXJyYXk8bnVtYmVyPjsgdXY6IEFycmF5PG51bWJlcj4gfT4gPSBbXTsgLy9DcmVhdGUgYSB0dXBsZSB3aXRoIGluZGljZSBvZiBQb3NpdGlvbiwgTm9ybWFsLCBVViAgW3Bvcywgbm9ybSwgdXZzXVxyXG4gICAgcHJpdmF0ZSBfY3VyUG9zaXRpb25JbkluZGljZXMgPSAwO1xyXG4gICAgcHJpdmF0ZSBfaGFzTWVzaGVzOiBCb29sZWFuID0gZmFsc2U7IC8vTWVzaGVzIGFyZSBkZWZpbmVkIGluIHRoZSBmaWxlXHJcbiAgICBwcml2YXRlIF91bndyYXBwZWRQb3NpdGlvbnNGb3JCYWJ5bG9uOiBBcnJheTxudW1iZXI+ID0gW107IC8vVmFsdWUgb2YgcG9zaXRpb25Gb3JCYWJ5bG9uIHcvbyBWZWN0b3IzKCkgW3gseSx6XVxyXG4gICAgcHJpdmF0ZSBfdW53cmFwcGVkQ29sb3JzRm9yQmFieWxvbjogQXJyYXk8bnVtYmVyPiA9IFtdOyAvLyBWYWx1ZSBvZiBjb2xvckZvckJhYnlsb24gdy9vIENvbG9yNCgpIFtyLGcsYixhXVxyXG4gICAgcHJpdmF0ZSBfdW53cmFwcGVkTm9ybWFsc0ZvckJhYnlsb246IEFycmF5PG51bWJlcj4gPSBbXTsgLy9WYWx1ZSBvZiBub3JtYWxzRm9yQmFieWxvbiB3L28gVmVjdG9yMygpICBbeCx5LHpdXHJcbiAgICBwcml2YXRlIF91bndyYXBwZWRVVkZvckJhYnlsb246IEFycmF5PG51bWJlcj4gPSBbXTsgLy9WYWx1ZSBvZiB1dnNGb3JCYWJ5bG9uIHcvbyBWZWN0b3IzKCkgICAgICBbeCx5LHpdXHJcbiAgICBwcml2YXRlIF90cmlhbmdsZXM6IEFycmF5PHN0cmluZz4gPSBbXTsgLy9JbmRpY2VzIGZyb20gbmV3IHRyaWFuZ2xlcyBjb21pbmcgZnJvbSBwb2x5Z29uc1xyXG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWxOYW1lRnJvbU9iajogc3RyaW5nID0gXCJcIjsgLy9UaGUgbmFtZSBvZiB0aGUgY3VycmVudCBtYXRlcmlhbFxyXG4gICAgcHJpdmF0ZSBfb2JqTWVzaE5hbWU6IHN0cmluZyA9IFwiXCI7IC8vVGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgb2JqIG1lc2hcclxuICAgIHByaXZhdGUgX2luY3JlbWVudDogbnVtYmVyID0gMTsgLy9JZCBmb3IgbWVzaGVzIGNyZWF0ZWQgYnkgdGhlIG11bHRpbWF0ZXJpYWxcclxuICAgIHByaXZhdGUgX2lzRmlyc3RNYXRlcmlhbDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9ncmF5Q29sb3IgPSBuZXcgQ29sb3I0KDAuNSwgMC41LCAwLjUsIDEpO1xyXG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWxUb1VzZTogc3RyaW5nW107XHJcbiAgICBwcml2YXRlIF9iYWJ5bG9uTWVzaGVzQXJyYXk6IEFycmF5PE1lc2g+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBTb2xpZFBhcnNlclxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsVG9Vc2UgZGVmaW5lcyB0aGUgYXJyYXkgdG8gZmlsbCB3aXRoIHRoZSBsaXN0IG9mIG1hdGVyaWFscyB0byB1c2UgKGl0IHdpbGwgYmUgZmlsbGVkIGJ5IHRoZSBwYXJzZSBmdW5jdGlvbilcclxuICAgICAqIEBwYXJhbSBiYWJ5bG9uTWVzaGVzQXJyYXkgZGVmaW5lcyB0aGUgYXJyYXkgdG8gZmlsbCB3aXRoIHRoZSBsaXN0IG9mIGxvYWRlZCBtZXNoZXMgKGl0IHdpbGwgYmUgZmlsbGVkIGJ5IHRoZSBwYXJzZSBmdW5jdGlvbilcclxuICAgICAqIEBwYXJhbSBsb2FkaW5nT3B0aW9ucyBkZWZpbmVzIHRoZSBsb2FkaW5nIG9wdGlvbnMgdG8gdXNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihtYXRlcmlhbFRvVXNlOiBzdHJpbmdbXSwgYmFieWxvbk1lc2hlc0FycmF5OiBBcnJheTxNZXNoPiwgbG9hZGluZ09wdGlvbnM6IE9CSkxvYWRpbmdPcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxUb1VzZSA9IG1hdGVyaWFsVG9Vc2U7XHJcbiAgICAgICAgdGhpcy5fYmFieWxvbk1lc2hlc0FycmF5ID0gYmFieWxvbk1lc2hlc0FycmF5O1xyXG4gICAgICAgIHRoaXMuX2xvYWRpbmdPcHRpb25zID0gbG9hZGluZ09wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWFyY2ggZm9yIG9iaiBpbiB0aGUgZ2l2ZW4gYXJyYXkuXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB0byBjaGVjayBpZiBhIGNvdXBsZSBvZiBkYXRhIGFscmVhZHkgZXhpc3RzIGluIGFuIGFycmF5LlxyXG4gICAgICpcclxuICAgICAqIElmIGZvdW5kLCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmRlZCB0dXBsZSBpbmRleC4gUmV0dXJucyAtMSBpZiBub3QgZm91bmRcclxuICAgICAqIEBwYXJhbSBhcnIgQXJyYXk8eyBub3JtYWxzOiBBcnJheTxudW1iZXI+LCBpZHg6IEFycmF5PG51bWJlcj4gfT5cclxuICAgICAqIEBwYXJhbSBvYmogQXJyYXk8bnVtYmVyPlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2lzSW5BcnJheShhcnI6IEFycmF5PHsgbm9ybWFsczogQXJyYXk8bnVtYmVyPjsgaWR4OiBBcnJheTxudW1iZXI+IH0+LCBvYmo6IEFycmF5PG51bWJlcj4pIHtcclxuICAgICAgICBpZiAoIWFycltvYmpbMF1dKSB7XHJcbiAgICAgICAgICAgIGFycltvYmpbMF1dID0geyBub3JtYWxzOiBbXSwgaWR4OiBbXSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpZHggPSBhcnJbb2JqWzBdXS5ub3JtYWxzLmluZGV4T2Yob2JqWzFdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGlkeCA9PT0gLTEgPyAtMSA6IGFycltvYmpbMF1dLmlkeFtpZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzSW5BcnJheVVWKGFycjogQXJyYXk8eyBub3JtYWxzOiBBcnJheTxudW1iZXI+OyBpZHg6IEFycmF5PG51bWJlcj47IHV2OiBBcnJheTxudW1iZXI+IH0+LCBvYmo6IEFycmF5PG51bWJlcj4pIHtcclxuICAgICAgICBpZiAoIWFycltvYmpbMF1dKSB7XHJcbiAgICAgICAgICAgIGFycltvYmpbMF1dID0geyBub3JtYWxzOiBbXSwgaWR4OiBbXSwgdXY6IFtdIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGlkeCA9IGFycltvYmpbMF1dLm5vcm1hbHMuaW5kZXhPZihvYmpbMV0pO1xyXG5cclxuICAgICAgICBpZiAoaWR4ICE9IDEgJiYgb2JqWzJdID09PSBhcnJbb2JqWzBdXS51dltpZHhdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJbb2JqWzBdXS5pZHhbaWR4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiBzZXQgdGhlIGRhdGEgZm9yIGVhY2ggdHJpYW5nbGUuXHJcbiAgICAgKiBEYXRhIGFyZSBwb3NpdGlvbiwgbm9ybWFscyBhbmQgdXZzXHJcbiAgICAgKiBJZiBhIHR1cGxlIG9mIChwb3NpdGlvbiwgbm9ybWFsKSBpcyBub3Qgc2V0LCBhZGQgdGhlIGRhdGEgaW50byB0aGUgY29ycmVzcG9uZGluZyBhcnJheVxyXG4gICAgICogSWYgdGhlIHR1cGxlIGFscmVhZHkgZXhpc3QsIGFkZCBvbmx5IHRoZWlyIGluZGljZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbmRpY2VQb3NpdGlvbkZyb21PYmogSW50ZWdlciBUaGUgaW5kZXggaW4gcG9zaXRpb25zIGFycmF5XHJcbiAgICAgKiBAcGFyYW0gaW5kaWNlVXZzRnJvbU9iaiBJbnRlZ2VyIFRoZSBpbmRleCBpbiB1dnMgYXJyYXlcclxuICAgICAqIEBwYXJhbSBpbmRpY2VOb3JtYWxGcm9tT2JqIEludGVnZXIgVGhlIGluZGV4IGluIG5vcm1hbHMgYXJyYXlcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvblZlY3RvckZyb21PQkogVmVjdG9yMyBUaGUgdmFsdWUgb2YgcG9zaXRpb24gYXQgaW5kZXggb2JqSW5kaWNlXHJcbiAgICAgKiBAcGFyYW0gdGV4dHVyZVZlY3RvckZyb21PQkogVmVjdG9yMyBUaGUgdmFsdWUgb2YgdXZzXHJcbiAgICAgKiBAcGFyYW0gbm9ybWFsc1ZlY3RvckZyb21PQkogVmVjdG9yMyBUaGUgdmFsdWUgb2Ygbm9ybWFscyBhdCBpbmRleCBvYmpOb3JtYWxlXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb25Db2xvcnNGcm9tT0JKXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NldERhdGEoXHJcbiAgICAgICAgaW5kaWNlUG9zaXRpb25Gcm9tT2JqOiBudW1iZXIsXHJcbiAgICAgICAgaW5kaWNlVXZzRnJvbU9iajogbnVtYmVyLFxyXG4gICAgICAgIGluZGljZU5vcm1hbEZyb21PYmo6IG51bWJlcixcclxuICAgICAgICBwb3NpdGlvblZlY3RvckZyb21PQko6IFZlY3RvcjMsXHJcbiAgICAgICAgdGV4dHVyZVZlY3RvckZyb21PQko6IFZlY3RvcjIsXHJcbiAgICAgICAgbm9ybWFsc1ZlY3RvckZyb21PQko6IFZlY3RvcjMsXHJcbiAgICAgICAgcG9zaXRpb25Db2xvcnNGcm9tT0JKPzogQ29sb3I0XHJcbiAgICApIHtcclxuICAgICAgICAvL0NoZWNrIGlmIHRoaXMgdHVwbGUgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGxpc3Qgb2YgdHVwbGVzXHJcbiAgICAgICAgbGV0IF9pbmRleDogbnVtYmVyO1xyXG4gICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5vcHRpbWl6ZVdpdGhVVikge1xyXG4gICAgICAgICAgICBfaW5kZXggPSB0aGlzLl9pc0luQXJyYXlVVih0aGlzLl90dXBsZVBvc05vcm0sIFtpbmRpY2VQb3NpdGlvbkZyb21PYmosIGluZGljZU5vcm1hbEZyb21PYmosIGluZGljZVV2c0Zyb21PYmpdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfaW5kZXggPSB0aGlzLl9pc0luQXJyYXkodGhpcy5fdHVwbGVQb3NOb3JtLCBbaW5kaWNlUG9zaXRpb25Gcm9tT2JqLCBpbmRpY2VOb3JtYWxGcm9tT2JqXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0lmIGl0IG5vdCBleGlzdHNcclxuICAgICAgICBpZiAoX2luZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAvL0FkZCBhbiBuZXcgaW5kaWNlLlxyXG4gICAgICAgICAgICAvL1RoZSBhcnJheSBvZiBpbmRpY2VzIGlzIG9ubHkgYW4gYXJyYXkgd2l0aCBoaXMgbGVuZ3RoIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgdHJpYW5nbGVzIC0gMS5cclxuICAgICAgICAgICAgLy9XZSBhZGQgdmVydGljZXMgZGF0YSBpbiB0aGlzIG9yZGVyXHJcbiAgICAgICAgICAgIHRoaXMuX2luZGljZXNGb3JCYWJ5bG9uLnB1c2godGhpcy5fd3JhcHBlZFBvc2l0aW9uRm9yQmFieWxvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICAvL1B1c2ggdGhlIHBvc2l0aW9uIG9mIHZlcnRpY2UgZm9yIEJhYnlsb25cclxuICAgICAgICAgICAgLy9FYWNoIGVsZW1lbnQgaXMgYSBWZWN0b3IzKHgseSx6KVxyXG4gICAgICAgICAgICB0aGlzLl93cmFwcGVkUG9zaXRpb25Gb3JCYWJ5bG9uLnB1c2gocG9zaXRpb25WZWN0b3JGcm9tT0JKKTtcclxuICAgICAgICAgICAgLy9QdXNoIHRoZSB1dnMgZm9yIEJhYnlsb25cclxuICAgICAgICAgICAgLy9FYWNoIGVsZW1lbnQgaXMgYSBWZWN0b3IzKHUsdilcclxuICAgICAgICAgICAgdGhpcy5fd3JhcHBlZFV2c0ZvckJhYnlsb24ucHVzaCh0ZXh0dXJlVmVjdG9yRnJvbU9CSik7XHJcbiAgICAgICAgICAgIC8vUHVzaCB0aGUgbm9ybWFscyBmb3IgQmFieWxvblxyXG4gICAgICAgICAgICAvL0VhY2ggZWxlbWVudCBpcyBhIFZlY3RvcjMoeCx5LHopXHJcbiAgICAgICAgICAgIHRoaXMuX3dyYXBwZWROb3JtYWxzRm9yQmFieWxvbi5wdXNoKG5vcm1hbHNWZWN0b3JGcm9tT0JKKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbkNvbG9yc0Zyb21PQkogIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLy9QdXNoIHRoZSBjb2xvcnMgZm9yIEJhYnlsb25cclxuICAgICAgICAgICAgICAgIC8vRWFjaCBlbGVtZW50IGlzIGEgQkFCWUxPTi5Db2xvcjQocixnLGIsYSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uLnB1c2gocG9zaXRpb25Db2xvcnNGcm9tT0JKKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9BZGQgdGhlIHR1cGxlIGluIHRoZSBjb21wYXJpc29uIGxpc3RcclxuICAgICAgICAgICAgdGhpcy5fdHVwbGVQb3NOb3JtW2luZGljZVBvc2l0aW9uRnJvbU9ial0ubm9ybWFscy5wdXNoKGluZGljZU5vcm1hbEZyb21PYmopO1xyXG4gICAgICAgICAgICB0aGlzLl90dXBsZVBvc05vcm1baW5kaWNlUG9zaXRpb25Gcm9tT2JqXS5pZHgucHVzaCh0aGlzLl9jdXJQb3NpdGlvbkluSW5kaWNlcysrKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdPcHRpb25zLm9wdGltaXplV2l0aFVWKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90dXBsZVBvc05vcm1baW5kaWNlUG9zaXRpb25Gcm9tT2JqXS51di5wdXNoKGluZGljZVV2c0Zyb21PYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9UaGUgdHVwbGUgYWxyZWFkeSBleGlzdHNcclxuICAgICAgICAgICAgLy9BZGQgdGhlIGluZGV4IG9mIHRoZSBhbHJlYWR5IGV4aXN0aW5nIHR1cGxlXHJcbiAgICAgICAgICAgIC8vQXQgdGhpcyBpbmRleCB3ZSBjYW4gZ2V0IHRoZSB2YWx1ZSBvZiBwb3NpdGlvbiwgbm9ybWFsLCBjb2xvciBhbmQgdXZzIG9mIHZlcnRleFxyXG4gICAgICAgICAgICB0aGlzLl9pbmRpY2VzRm9yQmFieWxvbi5wdXNoKF9pbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhbnNmb3JtIFZlY3RvcigpIGFuZCBCQUJZTE9OLkNvbG9yKCkgb2JqZWN0cyBpbnRvIG51bWJlcnMgaW4gYW4gYXJyYXlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdW53cmFwRGF0YSgpIHtcclxuICAgICAgICAvL0V2ZXJ5IGFycmF5IGhhcyB0aGUgc2FtZSBsZW5ndGhcclxuICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IHRoaXMuX3dyYXBwZWRQb3NpdGlvbkZvckJhYnlsb24ubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICAgICAgLy9QdXNoIHRoZSB4LCB5LCB6IHZhbHVlcyBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIHVud3JhcHBlZCBhcnJheVxyXG4gICAgICAgICAgICB0aGlzLl91bndyYXBwZWRQb3NpdGlvbnNGb3JCYWJ5bG9uLnB1c2godGhpcy5fd3JhcHBlZFBvc2l0aW9uRm9yQmFieWxvbltsXS54LCB0aGlzLl93cmFwcGVkUG9zaXRpb25Gb3JCYWJ5bG9uW2xdLnksIHRoaXMuX3dyYXBwZWRQb3NpdGlvbkZvckJhYnlsb25bbF0ueik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vud3JhcHBlZE5vcm1hbHNGb3JCYWJ5bG9uLnB1c2godGhpcy5fd3JhcHBlZE5vcm1hbHNGb3JCYWJ5bG9uW2xdLngsIHRoaXMuX3dyYXBwZWROb3JtYWxzRm9yQmFieWxvbltsXS55LCB0aGlzLl93cmFwcGVkTm9ybWFsc0ZvckJhYnlsb25bbF0ueik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vud3JhcHBlZFVWRm9yQmFieWxvbi5wdXNoKHRoaXMuX3dyYXBwZWRVdnNGb3JCYWJ5bG9uW2xdLngsIHRoaXMuX3dyYXBwZWRVdnNGb3JCYWJ5bG9uW2xdLnkpOyAvL3ogaXMgYW4gb3B0aW9uYWwgdmFsdWUgbm90IHN1cHBvcnRlZCBieSBCQUJZTE9OXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5pbXBvcnRWZXJ0ZXhDb2xvcnMpIHtcclxuICAgICAgICAgICAgICAgIC8vUHVzaCB0aGUgciwgZywgYiwgYSB2YWx1ZXMgb2YgZWFjaCBlbGVtZW50IGluIHRoZSB1bndyYXBwZWQgYXJyYXlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Vud3JhcHBlZENvbG9yc0ZvckJhYnlsb24ucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93cmFwcGVkQ29sb3JzRm9yQmFieWxvbltsXS5yLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uW2xdLmcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd3JhcHBlZENvbG9yc0ZvckJhYnlsb25bbF0uYixcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93cmFwcGVkQ29sb3JzRm9yQmFieWxvbltsXS5hXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlc2V0IGFycmF5cyBmb3IgdGhlIG5leHQgbmV3IG1lc2hlc1xyXG4gICAgICAgIHRoaXMuX3dyYXBwZWRQb3NpdGlvbkZvckJhYnlsb24ubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkTm9ybWFsc0ZvckJhYnlsb24ubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl93cmFwcGVkVXZzRm9yQmFieWxvbi5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX3dyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fdHVwbGVQb3NOb3JtLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fY3VyUG9zaXRpb25JbkluZGljZXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRyaWFuZ2xlcyBmcm9tIHBvbHlnb25zXHJcbiAgICAgKiBJdCBpcyBpbXBvcnRhbnQgdG8gbm90aWNlIHRoYXQgYSB0cmlhbmdsZSBpcyBhIHBvbHlnb25cclxuICAgICAqIFdlIGdldCA1IHBhdHRlcm5zIG9mIGZhY2UgZGVmaW5lZCBpbiBPQkogRmlsZSA6XHJcbiAgICAgKiBmYWNlUGF0dGVybjEgPSBbXCIxXCIsXCIyXCIsXCIzXCIsXCI0XCIsXCI1XCIsXCI2XCJdXHJcbiAgICAgKiBmYWNlUGF0dGVybjIgPSBbXCIxLzFcIixcIjIvMlwiLFwiMy8zXCIsXCI0LzRcIixcIjUvNVwiLFwiNi82XCJdXHJcbiAgICAgKiBmYWNlUGF0dGVybjMgPSBbXCIxLzEvMVwiLFwiMi8yLzJcIixcIjMvMy8zXCIsXCI0LzQvNFwiLFwiNS81LzVcIixcIjYvNi82XCJdXHJcbiAgICAgKiBmYWNlUGF0dGVybjQgPSBbXCIxLy8xXCIsXCIyLy8yXCIsXCIzLy8zXCIsXCI0Ly80XCIsXCI1Ly81XCIsXCI2Ly82XCJdXHJcbiAgICAgKiBmYWNlUGF0dGVybjUgPSBbXCItMS8tMS8tMVwiLFwiLTIvLTIvLTJcIixcIi0zLy0zLy0zXCIsXCItNC8tNC8tNFwiLFwiLTUvLTUvLTVcIixcIi02Ly02Ly02XCJdXHJcbiAgICAgKiBFYWNoIHBhdHRlcm4gaXMgZGl2aWRlZCBieSB0aGUgc2FtZSBtZXRob2RcclxuICAgICAqIEBwYXJhbSBmYWNlcyBBcnJheVtTdHJpbmddIFRoZSBpbmRpY2VzIG9mIGVsZW1lbnRzXHJcbiAgICAgKiBAcGFyYW0gdiBJbnRlZ2VyIFRoZSB2YXJpYWJsZSB0byBpbmNyZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZ2V0VHJpYW5nbGVzKGZhY2VzOiBBcnJheTxzdHJpbmc+LCB2OiBudW1iZXIpIHtcclxuICAgICAgICAvL1dvcmsgZm9yIGVhY2ggZWxlbWVudCBvZiB0aGUgYXJyYXlcclxuICAgICAgICBmb3IgKGxldCBmYWNlSW5kZXggPSB2OyBmYWNlSW5kZXggPCBmYWNlcy5sZW5ndGggLSAxOyBmYWNlSW5kZXgrKykge1xyXG4gICAgICAgICAgICAvL0FkZCBvbiB0aGUgdHJpYW5nbGUgdmFyaWFibGUgdGhlIGluZGV4ZXMgdG8gb2J0YWluIHRyaWFuZ2xlc1xyXG4gICAgICAgICAgICB0aGlzLl90cmlhbmdsZXMucHVzaChmYWNlc1swXSwgZmFjZXNbZmFjZUluZGV4XSwgZmFjZXNbZmFjZUluZGV4ICsgMV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXN1bHQgb2J0YWluZWQgYWZ0ZXIgMiBpdGVyYXRpb25zOlxyXG4gICAgICAgIC8vUGF0dGVybjEgPT4gdHJpYW5nbGUgPSBbXCIxXCIsXCIyXCIsXCIzXCIsXCIxXCIsXCIzXCIsXCI0XCJdO1xyXG4gICAgICAgIC8vUGF0dGVybjIgPT4gdHJpYW5nbGUgPSBbXCIxLzFcIixcIjIvMlwiLFwiMy8zXCIsXCIxLzFcIixcIjMvM1wiLFwiNC80XCJdO1xyXG4gICAgICAgIC8vUGF0dGVybjMgPT4gdHJpYW5nbGUgPSBbXCIxLzEvMVwiLFwiMi8yLzJcIixcIjMvMy8zXCIsXCIxLzEvMVwiLFwiMy8zLzNcIixcIjQvNC80XCJdO1xyXG4gICAgICAgIC8vUGF0dGVybjQgPT4gdHJpYW5nbGUgPSBbXCIxLy8xXCIsXCIyLy8yXCIsXCIzLy8zXCIsXCIxLy8xXCIsXCIzLy8zXCIsXCI0Ly80XCJdO1xyXG4gICAgICAgIC8vUGF0dGVybjUgPT4gdHJpYW5nbGUgPSBbXCItMS8tMS8tMVwiLFwiLTIvLTIvLTJcIixcIi0zLy0zLy0zXCIsXCItMS8tMS8tMVwiLFwiLTMvLTMvLTNcIixcIi00Ly00Ly00XCJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRyaWFuZ2xlcyBhbmQgcHVzaCB0aGUgZGF0YSBmb3IgZWFjaCBwb2x5Z29uIGZvciB0aGUgcGF0dGVybiAxXHJcbiAgICAgKiBJbiB0aGlzIHBhdHRlcm4gd2UgZ2V0IHZlcnRpY2UgcG9zaXRpb25zXHJcbiAgICAgKiBAcGFyYW0gZmFjZVxyXG4gICAgICogQHBhcmFtIHZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfc2V0RGF0YUZvckN1cnJlbnRGYWNlV2l0aFBhdHRlcm4xKGZhY2U6IEFycmF5PHN0cmluZz4sIHY6IG51bWJlcikge1xyXG4gICAgICAgIC8vR2V0IHRoZSBpbmRpY2VzIG9mIHRyaWFuZ2xlcyBmb3IgZWFjaCBwb2x5Z29uXHJcbiAgICAgICAgdGhpcy5fZ2V0VHJpYW5nbGVzKGZhY2UsIHYpO1xyXG4gICAgICAgIC8vRm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgdHJpYW5nbGVzIGFycmF5LlxyXG4gICAgICAgIC8vVGhpcyB2YXIgY291bGQgY29udGFpbnMgMSB0byBhbiBpbmZpbml0eSBvZiB0cmlhbmdsZXNcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuX3RyaWFuZ2xlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAvLyBTZXQgcG9zaXRpb24gaW5kaWNlXHJcbiAgICAgICAgICAgIGNvbnN0IGluZGljZVBvc2l0aW9uRnJvbU9iaiA9IHBhcnNlSW50KHRoaXMuX3RyaWFuZ2xlc1trXSkgLSAxO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2V0RGF0YShcclxuICAgICAgICAgICAgICAgIGluZGljZVBvc2l0aW9uRnJvbU9iaixcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAvLyBJbiB0aGUgcGF0dGVybiAxLCBub3JtYWxzIGFuZCB1dnMgYXJlIG5vdCBkZWZpbmVkXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wb3NpdGlvbnNbaW5kaWNlUG9zaXRpb25Gcm9tT2JqXSwgLy8gR2V0IHRoZSB2ZWN0b3JzIGRhdGFcclxuICAgICAgICAgICAgICAgIFZlY3RvcjIuWmVybygpLFxyXG4gICAgICAgICAgICAgICAgVmVjdG9yMy5VcCgpLCAvLyBDcmVhdGUgZGVmYXVsdCB2ZWN0b3JzXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkaW5nT3B0aW9ucy5pbXBvcnRWZXJ0ZXhDb2xvcnMgPyB0aGlzLl9jb2xvcnNbaW5kaWNlUG9zaXRpb25Gcm9tT2JqXSA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL1Jlc2V0IHZhcmlhYmxlIGZvciB0aGUgbmV4dCBsaW5lXHJcbiAgICAgICAgdGhpcy5fdHJpYW5nbGVzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdHJpYW5nbGVzIGFuZCBwdXNoIHRoZSBkYXRhIGZvciBlYWNoIHBvbHlnb24gZm9yIHRoZSBwYXR0ZXJuIDJcclxuICAgICAqIEluIHRoaXMgcGF0dGVybiB3ZSBnZXQgdmVydGljZSBwb3NpdGlvbnMgYW5kIHV2c1xyXG4gICAgICogQHBhcmFtIGZhY2VcclxuICAgICAqIEBwYXJhbSB2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NldERhdGFGb3JDdXJyZW50RmFjZVdpdGhQYXR0ZXJuMihmYWNlOiBBcnJheTxzdHJpbmc+LCB2OiBudW1iZXIpIHtcclxuICAgICAgICAvL0dldCB0aGUgaW5kaWNlcyBvZiB0cmlhbmdsZXMgZm9yIGVhY2ggcG9seWdvblxyXG4gICAgICAgIHRoaXMuX2dldFRyaWFuZ2xlcyhmYWNlLCB2KTtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuX3RyaWFuZ2xlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAvL3RyaWFuZ2xlW2tdID0gXCIxLzFcIlxyXG4gICAgICAgICAgICAvL1NwbGl0IHRoZSBkYXRhIGZvciBnZXR0aW5nIHBvc2l0aW9uIGFuZCB1dlxyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuX3RyaWFuZ2xlc1trXS5zcGxpdChcIi9cIik7IC8vIFtcIjFcIiwgXCIxXCJdXHJcbiAgICAgICAgICAgIC8vU2V0IHBvc2l0aW9uIGluZGljZVxyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VQb3NpdGlvbkZyb21PYmogPSBwYXJzZUludChwb2ludFswXSkgLSAxO1xyXG4gICAgICAgICAgICAvL1NldCB1diBpbmRpY2VcclxuICAgICAgICAgICAgY29uc3QgaW5kaWNlVXZzRnJvbU9iaiA9IHBhcnNlSW50KHBvaW50WzFdKSAtIDE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zZXREYXRhKFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlUG9zaXRpb25Gcm9tT2JqLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlVXZzRnJvbU9iaixcclxuICAgICAgICAgICAgICAgIDAsIC8vRGVmYXVsdCB2YWx1ZSBmb3Igbm9ybWFsc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25zW2luZGljZVBvc2l0aW9uRnJvbU9ial0sIC8vR2V0IHRoZSB2YWx1ZXMgZm9yIGVhY2ggZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXZzW2luZGljZVV2c0Zyb21PYmpdLFxyXG4gICAgICAgICAgICAgICAgVmVjdG9yMy5VcCgpLCAvL0RlZmF1bHQgdmFsdWUgZm9yIG5vcm1hbHNcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdPcHRpb25zLmltcG9ydFZlcnRleENvbG9ycyA/IHRoaXMuX2NvbG9yc1tpbmRpY2VQb3NpdGlvbkZyb21PYmpdIDogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Jlc2V0IHZhcmlhYmxlIGZvciB0aGUgbmV4dCBsaW5lXHJcbiAgICAgICAgdGhpcy5fdHJpYW5nbGVzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdHJpYW5nbGVzIGFuZCBwdXNoIHRoZSBkYXRhIGZvciBlYWNoIHBvbHlnb24gZm9yIHRoZSBwYXR0ZXJuIDNcclxuICAgICAqIEluIHRoaXMgcGF0dGVybiB3ZSBnZXQgdmVydGljZSBwb3NpdGlvbnMsIHV2cyBhbmQgbm9ybWFsc1xyXG4gICAgICogQHBhcmFtIGZhY2VcclxuICAgICAqIEBwYXJhbSB2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3NldERhdGFGb3JDdXJyZW50RmFjZVdpdGhQYXR0ZXJuMyhmYWNlOiBBcnJheTxzdHJpbmc+LCB2OiBudW1iZXIpIHtcclxuICAgICAgICAvL0dldCB0aGUgaW5kaWNlcyBvZiB0cmlhbmdsZXMgZm9yIGVhY2ggcG9seWdvblxyXG4gICAgICAgIHRoaXMuX2dldFRyaWFuZ2xlcyhmYWNlLCB2KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLl90cmlhbmdsZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgLy90cmlhbmdsZVtrXSA9IFwiMS8xLzFcIlxyXG4gICAgICAgICAgICAvL1NwbGl0IHRoZSBkYXRhIGZvciBnZXR0aW5nIHBvc2l0aW9uLCB1diwgYW5kIG5vcm1hbHNcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLl90cmlhbmdsZXNba10uc3BsaXQoXCIvXCIpOyAvLyBbXCIxXCIsIFwiMVwiLCBcIjFcIl1cclxuICAgICAgICAgICAgLy8gU2V0IHBvc2l0aW9uIGluZGljZVxyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VQb3NpdGlvbkZyb21PYmogPSBwYXJzZUludChwb2ludFswXSkgLSAxO1xyXG4gICAgICAgICAgICAvLyBTZXQgdXYgaW5kaWNlXHJcbiAgICAgICAgICAgIGNvbnN0IGluZGljZVV2c0Zyb21PYmogPSBwYXJzZUludChwb2ludFsxXSkgLSAxO1xyXG4gICAgICAgICAgICAvLyBTZXQgbm9ybWFsIGluZGljZVxyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VOb3JtYWxGcm9tT2JqID0gcGFyc2VJbnQocG9pbnRbMl0pIC0gMTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NldERhdGEoXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VQb3NpdGlvbkZyb21PYmosXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VVdnNGcm9tT2JqLFxyXG4gICAgICAgICAgICAgICAgaW5kaWNlTm9ybWFsRnJvbU9iaixcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uc1tpbmRpY2VQb3NpdGlvbkZyb21PYmpdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXZzW2luZGljZVV2c0Zyb21PYmpdLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsc1tpbmRpY2VOb3JtYWxGcm9tT2JqXSAvL1NldCB0aGUgdmVjdG9yIGZvciBlYWNoIGNvbXBvbmVudFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL1Jlc2V0IHZhcmlhYmxlIGZvciB0aGUgbmV4dCBsaW5lXHJcbiAgICAgICAgdGhpcy5fdHJpYW5nbGVzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdHJpYW5nbGVzIGFuZCBwdXNoIHRoZSBkYXRhIGZvciBlYWNoIHBvbHlnb24gZm9yIHRoZSBwYXR0ZXJuIDRcclxuICAgICAqIEluIHRoaXMgcGF0dGVybiB3ZSBnZXQgdmVydGljZSBwb3NpdGlvbnMgYW5kIG5vcm1hbHNcclxuICAgICAqIEBwYXJhbSBmYWNlXHJcbiAgICAgKiBAcGFyYW0gdlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zZXREYXRhRm9yQ3VycmVudEZhY2VXaXRoUGF0dGVybjQoZmFjZTogQXJyYXk8c3RyaW5nPiwgdjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZ2V0VHJpYW5nbGVzKGZhY2UsIHYpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuX3RyaWFuZ2xlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAvL3RyaWFuZ2xlW2tdID0gXCIxLy8xXCJcclxuICAgICAgICAgICAgLy9TcGxpdCB0aGUgZGF0YSBmb3IgZ2V0dGluZyBwb3NpdGlvbiBhbmQgbm9ybWFsc1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMuX3RyaWFuZ2xlc1trXS5zcGxpdChcIi8vXCIpOyAvLyBbXCIxXCIsIFwiMVwiXVxyXG4gICAgICAgICAgICAvLyBXZSBjaGVjayBpbmRpY2VzLCBhbmQgbm9ybWFsc1xyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VQb3NpdGlvbkZyb21PYmogPSBwYXJzZUludChwb2ludFswXSkgLSAxO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VOb3JtYWxGcm9tT2JqID0gcGFyc2VJbnQocG9pbnRbMV0pIC0gMTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NldERhdGEoXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VQb3NpdGlvbkZyb21PYmosXHJcbiAgICAgICAgICAgICAgICAxLCAvL0RlZmF1bHQgdmFsdWUgZm9yIHV2XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VOb3JtYWxGcm9tT2JqLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25zW2luZGljZVBvc2l0aW9uRnJvbU9ial0sIC8vR2V0IGVhY2ggdmVjdG9yIG9mIGRhdGFcclxuICAgICAgICAgICAgICAgIFZlY3RvcjIuWmVybygpLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsc1tpbmRpY2VOb3JtYWxGcm9tT2JqXSxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdPcHRpb25zLmltcG9ydFZlcnRleENvbG9ycyA/IHRoaXMuX2NvbG9yc1tpbmRpY2VQb3NpdGlvbkZyb21PYmpdIDogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vUmVzZXQgdmFyaWFibGUgZm9yIHRoZSBuZXh0IGxpbmVcclxuICAgICAgICB0aGlzLl90cmlhbmdsZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlIHRyaWFuZ2xlcyBhbmQgcHVzaCB0aGUgZGF0YSBmb3IgZWFjaCBwb2x5Z29uIGZvciB0aGUgcGF0dGVybiAzXHJcbiAgICAgKiBJbiB0aGlzIHBhdHRlcm4gd2UgZ2V0IHZlcnRpY2UgcG9zaXRpb25zLCB1dnMgYW5kIG5vcm1hbHNcclxuICAgICAqIEBwYXJhbSBmYWNlXHJcbiAgICAgKiBAcGFyYW0gdlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9zZXREYXRhRm9yQ3VycmVudEZhY2VXaXRoUGF0dGVybjUoZmFjZTogQXJyYXk8c3RyaW5nPiwgdjogbnVtYmVyKSB7XHJcbiAgICAgICAgLy9HZXQgdGhlIGluZGljZXMgb2YgdHJpYW5nbGVzIGZvciBlYWNoIHBvbHlnb25cclxuICAgICAgICB0aGlzLl9nZXRUcmlhbmdsZXMoZmFjZSwgdik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5fdHJpYW5nbGVzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgIC8vdHJpYW5nbGVba10gPSBcIi0xLy0xLy0xXCJcclxuICAgICAgICAgICAgLy9TcGxpdCB0aGUgZGF0YSBmb3IgZ2V0dGluZyBwb3NpdGlvbiwgdXYsIGFuZCBub3JtYWxzXHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5fdHJpYW5nbGVzW2tdLnNwbGl0KFwiL1wiKTsgLy8gW1wiLTFcIiwgXCItMVwiLCBcIi0xXCJdXHJcbiAgICAgICAgICAgIC8vIFNldCBwb3NpdGlvbiBpbmRpY2VcclxuICAgICAgICAgICAgY29uc3QgaW5kaWNlUG9zaXRpb25Gcm9tT2JqID0gdGhpcy5fcG9zaXRpb25zLmxlbmd0aCArIHBhcnNlSW50KHBvaW50WzBdKTtcclxuICAgICAgICAgICAgLy8gU2V0IHV2IGluZGljZVxyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VVdnNGcm9tT2JqID0gdGhpcy5fdXZzLmxlbmd0aCArIHBhcnNlSW50KHBvaW50WzFdKTtcclxuICAgICAgICAgICAgLy8gU2V0IG5vcm1hbCBpbmRpY2VcclxuICAgICAgICAgICAgY29uc3QgaW5kaWNlTm9ybWFsRnJvbU9iaiA9IHRoaXMuX25vcm1hbHMubGVuZ3RoICsgcGFyc2VJbnQocG9pbnRbMl0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2V0RGF0YShcclxuICAgICAgICAgICAgICAgIGluZGljZVBvc2l0aW9uRnJvbU9iaixcclxuICAgICAgICAgICAgICAgIGluZGljZVV2c0Zyb21PYmosXHJcbiAgICAgICAgICAgICAgICBpbmRpY2VOb3JtYWxGcm9tT2JqLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25zW2luZGljZVBvc2l0aW9uRnJvbU9ial0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLl91dnNbaW5kaWNlVXZzRnJvbU9ial0sXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWxzW2luZGljZU5vcm1hbEZyb21PYmpdLCAvL1NldCB0aGUgdmVjdG9yIGZvciBlYWNoIGNvbXBvbmVudFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZGluZ09wdGlvbnMuaW1wb3J0VmVydGV4Q29sb3JzID8gdGhpcy5fY29sb3JzW2luZGljZVBvc2l0aW9uRnJvbU9ial0gOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9SZXNldCB2YXJpYWJsZSBmb3IgdGhlIG5leHQgbGluZVxyXG4gICAgICAgIHRoaXMuX3RyaWFuZ2xlcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkZFByZXZpb3VzT2JqTWVzaCgpIHtcclxuICAgICAgICAvL0NoZWNrIGlmIGl0IGlzIG5vdCB0aGUgZmlyc3QgbWVzaC4gT3RoZXJ3aXNlIHdlIGRvbid0IGhhdmUgZGF0YS5cclxuICAgICAgICBpZiAodGhpcy5fbWVzaGVzRnJvbU9iai5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vR2V0IHRoZSBwcmV2aW91cyBtZXNoIGZvciBhcHBseWluZyB0aGUgZGF0YSBhYm91dCB0aGUgZmFjZXNcclxuICAgICAgICAgICAgLy89PiBpbiBvYmogZmlsZSwgZmFjZXMgZGVmaW5pdGlvbiBhcHBlbmQgYWZ0ZXIgdGhlIG5hbWUgb2YgdGhlIG1lc2hcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2ggPSB0aGlzLl9tZXNoZXNGcm9tT2JqW3RoaXMuX21lc2hlc0Zyb21PYmoubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICAgICAgICAvL1NldCB0aGUgZGF0YSBpbnRvIEFycmF5IGZvciB0aGUgbWVzaFxyXG4gICAgICAgICAgICB0aGlzLl91bndyYXBEYXRhKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXZlcnNlIHRhYi4gT3RoZXJ3aXNlIGZhY2UgYXJlIGRpc3BsYXllZCBpbiB0aGUgd3Jvbmcgc2Vuc1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRpY2VzRm9yQmFieWxvbi5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIC8vU2V0IHRoZSBpbmZvcm1hdGlvbiBmb3IgdGhlIG1lc2hcclxuICAgICAgICAgICAgLy9TbGljZSB0aGUgYXJyYXkgdG8gYXZvaWQgcmV3cml0aW5nIGJlY2F1c2Ugb2YgdGhlIGZhY3QgdGhpcyBpcyB0aGUgc2FtZSB2YXIgd2hpY2ggYmUgcmV3cml0ZWRcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2guaW5kaWNlcyA9IHRoaXMuX2luZGljZXNGb3JCYWJ5bG9uLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZWRNZXNoLnBvc2l0aW9ucyA9IHRoaXMuX3Vud3JhcHBlZFBvc2l0aW9uc0ZvckJhYnlsb24uc2xpY2UoKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2gubm9ybWFscyA9IHRoaXMuX3Vud3JhcHBlZE5vcm1hbHNGb3JCYWJ5bG9uLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZWRNZXNoLnV2cyA9IHRoaXMuX3Vud3JhcHBlZFVWRm9yQmFieWxvbi5zbGljZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdPcHRpb25zLmltcG9ydFZlcnRleENvbG9ycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2guY29sb3JzID0gdGhpcy5fdW53cmFwcGVkQ29sb3JzRm9yQmFieWxvbi5zbGljZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL1Jlc2V0IHRoZSBhcnJheSBmb3IgdGhlIG5leHQgbWVzaFxyXG4gICAgICAgICAgICB0aGlzLl9pbmRpY2VzRm9yQmFieWxvbi5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl91bndyYXBwZWRQb3NpdGlvbnNGb3JCYWJ5bG9uLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3Vud3JhcHBlZENvbG9yc0ZvckJhYnlsb24ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fdW53cmFwcGVkTm9ybWFsc0ZvckJhYnlsb24ubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fdW53cmFwcGVkVVZGb3JCYWJ5bG9uLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29wdGltaXplTm9ybWFscyhtZXNoOiBBYnN0cmFjdE1lc2gpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBtZXNoLmdldFZlcnRpY2VzRGF0YShWZXJ0ZXhCdWZmZXIuUG9zaXRpb25LaW5kKTtcclxuICAgICAgICBjb25zdCBub3JtYWxzID0gbWVzaC5nZXRWZXJ0aWNlc0RhdGEoVmVydGV4QnVmZmVyLk5vcm1hbEtpbmQpO1xyXG4gICAgICAgIGNvbnN0IG1hcFZlcnRpY2VzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlcltdIH0gPSB7fTtcclxuXHJcbiAgICAgICAgaWYgKCFwb3NpdGlvbnMgfHwgIW5vcm1hbHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMubGVuZ3RoIC8gMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBwb3NpdGlvbnNbaSAqIDMgKyAwXTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IHBvc2l0aW9uc1tpICogMyArIDFdO1xyXG4gICAgICAgICAgICBjb25zdCB6ID0gcG9zaXRpb25zW2kgKiAzICsgMl07XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHggKyBcIl9cIiArIHkgKyBcIl9cIiArIHo7XHJcblxyXG4gICAgICAgICAgICBsZXQgbHN0ID0gbWFwVmVydGljZXNba2V5XTtcclxuICAgICAgICAgICAgaWYgKCFsc3QpIHtcclxuICAgICAgICAgICAgICAgIGxzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbWFwVmVydGljZXNba2V5XSA9IGxzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsc3QucHVzaChpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vcm1hbCA9IG5ldyBWZWN0b3IzKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbWFwVmVydGljZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbHN0ID0gbWFwVmVydGljZXNba2V5XTtcclxuICAgICAgICAgICAgaWYgKGxzdC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjBJZHggPSBsc3RbMF07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbHN0Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2SWR4ID0gbHN0W2ldO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsc1t2MElkeCAqIDMgKyAwXSArPSBub3JtYWxzW3ZJZHggKiAzICsgMF07XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzW3YwSWR4ICogMyArIDFdICs9IG5vcm1hbHNbdklkeCAqIDMgKyAxXTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHNbdjBJZHggKiAzICsgMl0gKz0gbm9ybWFsc1t2SWR4ICogMyArIDJdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBub3JtYWwuY29weUZyb21GbG9hdHMobm9ybWFsc1t2MElkeCAqIDMgKyAwXSwgbm9ybWFsc1t2MElkeCAqIDMgKyAxXSwgbm9ybWFsc1t2MElkeCAqIDMgKyAyXSk7XHJcbiAgICAgICAgICAgIG5vcm1hbC5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbHN0Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2SWR4ID0gbHN0W2ldO1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsc1t2SWR4ICogMyArIDBdID0gbm9ybWFsLng7XHJcbiAgICAgICAgICAgICAgICBub3JtYWxzW3ZJZHggKiAzICsgMV0gPSBub3JtYWwueTtcclxuICAgICAgICAgICAgICAgIG5vcm1hbHNbdklkeCAqIDMgKyAyXSA9IG5vcm1hbC56O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lc2guc2V0VmVydGljZXNEYXRhKFZlcnRleEJ1ZmZlci5Ob3JtYWxLaW5kLCBub3JtYWxzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gcGFyc2UgYW4gT0JKIHN0cmluZ1xyXG4gICAgICogQHBhcmFtIG1lc2hlc05hbWVzIGRlZmluZXMgdGhlIGxpc3Qgb2YgbWVzaGVzIHRvIGxvYWQgKGFsbCBpZiBub3QgZGVmaW5lZClcclxuICAgICAqIEBwYXJhbSBkYXRhIGRlZmluZXMgdGhlIE9CSiBzdHJpbmdcclxuICAgICAqIEBwYXJhbSBzY2VuZSBkZWZpbmVzIHRoZSBob3N0aW5nIHNjZW5lXHJcbiAgICAgKiBAcGFyYW0gYXNzZXRDb250YWluZXIgZGVmaW5lcyB0aGUgYXNzZXQgY29udGFpbmVyIHRvIGxvYWQgZGF0YSBpblxyXG4gICAgICogQHBhcmFtIG9uRmlsZVRvTG9hZEZvdW5kIGRlZmluZXMgYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIGlmIGEgTVRMIGZpbGUgaXMgZm91bmRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhcnNlKG1lc2hlc05hbWVzOiBhbnksIGRhdGE6IHN0cmluZywgc2NlbmU6IFNjZW5lLCBhc3NldENvbnRhaW5lcjogTnVsbGFibGU8QXNzZXRDb250YWluZXI+LCBvbkZpbGVUb0xvYWRGb3VuZDogKGZpbGVUb0xvYWQ6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgIC8vIFNwbGl0IHRoZSBmaWxlIGludG8gbGluZXNcclxuICAgICAgICBjb25zdCBsaW5lcyA9IGRhdGEuc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgLy8gTG9vayBhdCBlYWNoIGxpbmVcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXS50cmltKCkucmVwbGFjZSgvXFxzXFxzL2csIFwiIFwiKTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbW1lbnQgb3IgbmV3TGluZVxyXG4gICAgICAgICAgICBpZiAobGluZS5sZW5ndGggPT09IDAgfHwgbGluZS5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0dldCBpbmZvcm1hdGlvbiBhYm91dCBvbmUgcG9zaXRpb24gcG9zc2libGUgZm9yIHRoZSB2ZXJ0aWNlc1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFNvbGlkUGFyc2VyLlZlcnRleFBhdHRlcm4udGVzdChsaW5lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCgvW14gXSsvZykhOyAvLyBtYXRjaCB3aWxsIHJldHVybiBub24tbnVsbCBkdWUgdG8gcGFzc2luZyByZWdleCBwYXR0ZXJuXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVmFsdWUgb2YgcmVzdWx0IHdpdGggbGluZTogXCJ2IDEuMCAyLjAgMy4wXCJcclxuICAgICAgICAgICAgICAgIC8vIFtcInZcIiwgXCIxLjBcIiwgXCIyLjBcIiwgXCIzLjBcIl1cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIFZlY3RvcjMgd2l0aCB0aGUgcG9zaXRpb24geCwgeSwgelxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25zLnB1c2gobmV3IFZlY3RvcjMocGFyc2VGbG9hdChyZXN1bHRbMV0pLCBwYXJzZUZsb2F0KHJlc3VsdFsyXSksIHBhcnNlRmxvYXQocmVzdWx0WzNdKSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5pbXBvcnRWZXJ0ZXhDb2xvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+PSA3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBwYXJzZUZsb2F0KHJlc3VsdFs0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGcgPSBwYXJzZUZsb2F0KHJlc3VsdFs1XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGIgPSBwYXJzZUZsb2F0KHJlc3VsdFs2XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2xvcnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb2xvcjQociA+IDEgPyByIC8gMjU1IDogciwgZyA+IDEgPyBnIC8gMjU1IDogZywgYiA+IDEgPyBiIC8gMjU1IDogYiwgcmVzdWx0Lmxlbmd0aCA9PT0gNyB8fCByZXN1bHRbN10gPT09IHVuZGVmaW5lZCA/IDEgOiBwYXJzZUZsb2F0KHJlc3VsdFs3XSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogbWF5YmUgcHVzaCBOVUxMIGFuZCBpZiBhbGwgYXJlIE5VTEwgdG8gc2tpcCAoYW5kIHJlbW92ZSBncmF5Q29sb3IgdmFyKS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29sb3JzLnB1c2godGhpcy5fZ3JheUNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IFNvbGlkUGFyc2VyLk5vcm1hbFBhdHRlcm4uZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vQ3JlYXRlIGEgVmVjdG9yMyB3aXRoIHRoZSBub3JtYWxzIHgsIHksIHpcclxuICAgICAgICAgICAgICAgIC8vVmFsdWUgb2YgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2biAxLjAgMi4wIDMuMFwiLCBcIjEuMFwiLCBcIjIuMFwiLCBcIjMuMFwiXVxyXG4gICAgICAgICAgICAgICAgLy9BZGQgdGhlIFZlY3RvciBpbiB0aGUgbGlzdCBvZiBub3JtYWxzXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWxzLnB1c2gobmV3IFZlY3RvcjMocGFyc2VGbG9hdChyZXN1bHRbMV0pLCBwYXJzZUZsb2F0KHJlc3VsdFsyXSksIHBhcnNlRmxvYXQocmVzdWx0WzNdKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQgPSBTb2xpZFBhcnNlci5VVlBhdHRlcm4uZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vQ3JlYXRlIGEgVmVjdG9yMiB3aXRoIHRoZSBub3JtYWxzIHUsIHZcclxuICAgICAgICAgICAgICAgIC8vVmFsdWUgb2YgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAvLyBbXCJ2dCAwLjEgMC4yIDAuM1wiLCBcIjAuMVwiLCBcIjAuMlwiXVxyXG4gICAgICAgICAgICAgICAgLy9BZGQgdGhlIFZlY3RvciBpbiB0aGUgbGlzdCBvZiB1dnNcclxuICAgICAgICAgICAgICAgIHRoaXMuX3V2cy5wdXNoKG5ldyBWZWN0b3IyKHBhcnNlRmxvYXQocmVzdWx0WzFdKSAqIHRoaXMuX2xvYWRpbmdPcHRpb25zLlVWU2NhbGluZy54LCBwYXJzZUZsb2F0KHJlc3VsdFsyXSkgKiB0aGlzLl9sb2FkaW5nT3B0aW9ucy5VVlNjYWxpbmcueSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vSWRlbnRpZnkgcGF0dGVybnMgb2YgZmFjZXNcclxuICAgICAgICAgICAgICAgIC8vRmFjZSBjb3VsZCBiZSBkZWZpbmVkIGluIGRpZmZlcmVudCB0eXBlIG9mIHBhdHRlcm5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gU29saWRQYXJzZXIuRmFjZVBhdHRlcm4zLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvL1ZhbHVlIG9mIHJlc3VsdDpcclxuICAgICAgICAgICAgICAgIC8vW1wiZiAxLzEvMSAyLzIvMiAzLzMvM1wiLCBcIjEvMS8xIDIvMi8yIDMvMy8zXCIuLi5dXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TZXQgdGhlIGRhdGEgZm9yIHRoaXMgZmFjZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YUZvckN1cnJlbnRGYWNlV2l0aFBhdHRlcm4zKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFsxXS50cmltKCkuc3BsaXQoXCIgXCIpLCAvLyBbXCIxLzEvMVwiLCBcIjIvMi8yXCIsIFwiMy8zLzNcIl1cclxuICAgICAgICAgICAgICAgICAgICAxXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQgPSBTb2xpZFBhcnNlci5GYWNlUGF0dGVybjQuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vVmFsdWUgb2YgcmVzdWx0OlxyXG4gICAgICAgICAgICAgICAgLy9bXCJmIDEvLzEgMi8vMiAzLy8zXCIsIFwiMS8vMSAyLy8yIDMvLzNcIi4uLl1cclxuXHJcbiAgICAgICAgICAgICAgICAvL1NldCB0aGUgZGF0YSBmb3IgdGhpcyBmYWNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhRm9yQ3VycmVudEZhY2VXaXRoUGF0dGVybjQoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0WzFdLnRyaW0oKS5zcGxpdChcIiBcIiksIC8vIFtcIjEvLzFcIiwgXCIyLy8yXCIsIFwiMy8vM1wiXVxyXG4gICAgICAgICAgICAgICAgICAgIDFcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IFNvbGlkUGFyc2VyLkZhY2VQYXR0ZXJuNS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy9WYWx1ZSBvZiByZXN1bHQ6XHJcbiAgICAgICAgICAgICAgICAvL1tcImYgLTEvLTEvLTEgLTIvLTIvLTIgLTMvLTMvLTNcIiwgXCItMS8tMS8tMSAtMi8tMi8tMiAtMy8tMy8tM1wiLi4uXVxyXG5cclxuICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBkYXRhIGZvciB0aGlzIGZhY2VcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGFGb3JDdXJyZW50RmFjZVdpdGhQYXR0ZXJuNShcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbMV0udHJpbSgpLnNwbGl0KFwiIFwiKSwgLy8gW1wiLTEvLTEvLTFcIiwgXCItMi8tMi8tMlwiLCBcIi0zLy0zLy0zXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgMVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gU29saWRQYXJzZXIuRmFjZVBhdHRlcm4yLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvL1ZhbHVlIG9mIHJlc3VsdDpcclxuICAgICAgICAgICAgICAgIC8vW1wiZiAxLzEgMi8yIDMvM1wiLCBcIjEvMSAyLzIgMy8zXCIuLi5dXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TZXQgdGhlIGRhdGEgZm9yIHRoaXMgZmFjZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YUZvckN1cnJlbnRGYWNlV2l0aFBhdHRlcm4yKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFsxXS50cmltKCkuc3BsaXQoXCIgXCIpLCAvLyBbXCIxLzFcIiwgXCIyLzJcIiwgXCIzLzNcIl1cclxuICAgICAgICAgICAgICAgICAgICAxXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQgPSBTb2xpZFBhcnNlci5GYWNlUGF0dGVybjEuZXhlYyhsaW5lKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vVmFsdWUgb2YgcmVzdWx0XHJcbiAgICAgICAgICAgICAgICAvL1tcImYgMSAyIDNcIiwgXCIxIDIgM1wiLi4uXVxyXG5cclxuICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBkYXRhIGZvciB0aGlzIGZhY2VcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGFGb3JDdXJyZW50RmFjZVdpdGhQYXR0ZXJuMShcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbMV0udHJpbSgpLnNwbGl0KFwiIFwiKSwgLy8gW1wiMVwiLCBcIjJcIiwgXCIzXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgMVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgYSBtZXNoIG9yIGFuIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgLy8gRWFjaCB0aW1lIHRoaXMga2V5d29yZCBpcyBhbmFseXplZCwgY3JlYXRlIGEgbmV3IE9iamVjdCB3aXRoIGFsbCBkYXRhIGZvciBjcmVhdGluZyBhIGJhYnlsb25NZXNoXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IFNvbGlkUGFyc2VyLkxpbmVQYXR0ZXJuMS5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy9WYWx1ZSBvZiByZXN1bHRcclxuICAgICAgICAgICAgICAgIC8vW1wibCAxIDJcIl1cclxuXHJcbiAgICAgICAgICAgICAgICAvL1NldCB0aGUgZGF0YSBmb3IgdGhpcyBmYWNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRhRm9yQ3VycmVudEZhY2VXaXRoUGF0dGVybjEoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0WzFdLnRyaW0oKS5zcGxpdChcIiBcIiksIC8vIFtcIjFcIiwgXCIyXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgYSBtZXNoIG9yIGFuIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgLy8gRWFjaCB0aW1lIHRoaXMga2V5d29yZCBpcyBhbmFseXplZCwgY3JlYXRlIGEgbmV3IE9iamVjdCB3aXRoIGFsbCBkYXRhIGZvciBjcmVhdGluZyBhIGJhYnlsb25NZXNoXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHJlc3VsdCA9IFNvbGlkUGFyc2VyLkxpbmVQYXR0ZXJuMi5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy9WYWx1ZSBvZiByZXN1bHRcclxuICAgICAgICAgICAgICAgIC8vW1wibCAxLzEgMi8yXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TZXQgdGhlIGRhdGEgZm9yIHRoaXMgZmFjZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YUZvckN1cnJlbnRGYWNlV2l0aFBhdHRlcm4yKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFsxXS50cmltKCkuc3BsaXQoXCIgXCIpLCAvLyBbXCIxLzFcIiwgXCIyLzJcIl1cclxuICAgICAgICAgICAgICAgICAgICAwXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERlZmluZSBhIG1lc2ggb3IgYW4gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAvLyBFYWNoIHRpbWUgdGhpcyBrZXl3b3JkIGlzIGFuYWx5emVkLCBjcmVhdGUgYSBuZXcgT2JqZWN0IHdpdGggYWxsIGRhdGEgZm9yIGNyZWF0aW5nIGEgYmFieWxvbk1lc2hcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgocmVzdWx0ID0gU29saWRQYXJzZXIuTGluZVBhdHRlcm4zLmV4ZWMobGluZSkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvL1ZhbHVlIG9mIHJlc3VsdFxyXG4gICAgICAgICAgICAgICAgLy9bXCJsIDEvMS8xIDIvMi8yXCJdXHJcblxyXG4gICAgICAgICAgICAgICAgLy9TZXQgdGhlIGRhdGEgZm9yIHRoaXMgZmFjZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0YUZvckN1cnJlbnRGYWNlV2l0aFBhdHRlcm4zKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFsxXS50cmltKCkuc3BsaXQoXCIgXCIpLCAvLyBbXCIxLzEvMVwiLCBcIjIvMi8yXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgYSBtZXNoIG9yIGFuIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgLy8gRWFjaCB0aW1lIHRoaXMga2V5d29yZCBpcyBhbmFseXplZCwgY3JlYXRlIGEgbmV3IE9iamVjdCB3aXRoIGFsbCBkYXRhIGZvciBjcmVhdGluZyBhIGJhYnlsb25NZXNoXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU29saWRQYXJzZXIuR3JvdXBEZXNjcmlwdG9yLnRlc3QobGluZSkgfHwgU29saWRQYXJzZXIuT2JqZWN0RGVzY3JpcHRvci50ZXN0KGxpbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgbWVzaCBjb3JyZXNwb25kaW5nIHRvIHRoZSBuYW1lIG9mIHRoZSBncm91cC5cclxuICAgICAgICAgICAgICAgIC8vIERlZmluaXRpb24gb2YgdGhlIG1lc2hcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9iak1lc2g6IE1lc2hPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbGluZS5zdWJzdHJpbmcoMikudHJpbSgpLCAvL1NldCB0aGUgbmFtZSBvZiB0aGUgY3VycmVudCBvYmogbWVzaFxyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWxzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdXZzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxOYW1lOiB0aGlzLl9tYXRlcmlhbE5hbWVGcm9tT2JqLFxyXG4gICAgICAgICAgICAgICAgICAgIGlzT2JqZWN0OiBTb2xpZFBhcnNlci5PYmplY3REZXNjcmlwdG9yLnRlc3QobGluZSksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkUHJldmlvdXNPYmpNZXNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9QdXNoIHRoZSBsYXN0IG1lc2ggY3JlYXRlZCB3aXRoIG9ubHkgdGhlIG5hbWVcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc2hlc0Zyb21PYmoucHVzaChvYmpNZXNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1NldCB0aGlzIHZhcmlhYmxlIHRvIGluZGljYXRlIHRoYXQgbm93IG1lc2hlc0Zyb21PYmogaGFzIG9iamVjdHMgZGVmaW5lZCBpbnNpZGVcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc01lc2hlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZpcnN0TWF0ZXJpYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5jcmVtZW50ID0gMTtcclxuICAgICAgICAgICAgICAgIC8vS2V5d29yZCBmb3IgYXBwbHlpbmcgYSBtYXRlcmlhbFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFNvbGlkUGFyc2VyLlVzZU10bERlc2NyaXB0b3IudGVzdChsaW5lKSkge1xyXG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIG5hbWUgb2YgdGhlIG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbE5hbWVGcm9tT2JqID0gbGluZS5zdWJzdHJpbmcoNykudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vSWYgdGhpcyBuZXcgbWF0ZXJpYWwgaXMgaW4gdGhlIHNhbWUgbWVzaFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5faXNGaXJzdE1hdGVyaWFsIHx8ICF0aGlzLl9oYXNNZXNoZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1NldCB0aGUgZGF0YSBmb3IgdGhlIHByZXZpb3VzIG1lc2hcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRQcmV2aW91c09iak1lc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAvL0NyZWF0ZSBhIG5ldyBtZXNoXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqTWVzaDogTWVzaE9iamVjdCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG9iaiBtZXNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICh0aGlzLl9vYmpNZXNoTmFtZSB8fCBcIm1lc2hcIikgKyBcIl9tbVwiICsgdGhpcy5faW5jcmVtZW50LnRvU3RyaW5nKCksIC8vU2V0IHRoZSBuYW1lIG9mIHRoZSBjdXJyZW50IG9iaiBtZXNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbHM6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV2czogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbE5hbWU6IHRoaXMuX21hdGVyaWFsTmFtZUZyb21PYmosXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09iamVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5jcmVtZW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9JZiBtZXNoZXMgYXJlIGFscmVhZHkgZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21lc2hlc0Zyb21PYmoucHVzaChvYmpNZXNoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYXNNZXNoZXMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9TZXQgdGhlIG1hdGVyaWFsIG5hbWUgaWYgdGhlIHByZXZpb3VzIGxpbmUgZGVmaW5lIGEgbWVzaFxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9oYXNNZXNoZXMgJiYgdGhpcy5faXNGaXJzdE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9TZXQgdGhlIG1hdGVyaWFsIG5hbWUgdG8gdGhlIHByZXZpb3VzIG1lc2ggKDEgbWF0ZXJpYWwgcGVyIG1lc2gpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWVzaGVzRnJvbU9ialt0aGlzLl9tZXNoZXNGcm9tT2JqLmxlbmd0aCAtIDFdLm1hdGVyaWFsTmFtZSA9IHRoaXMuX21hdGVyaWFsTmFtZUZyb21PYmo7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNGaXJzdE1hdGVyaWFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBLZXl3b3JkIGZvciBsb2FkaW5nIHRoZSBtdGwgZmlsZVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFNvbGlkUGFyc2VyLk10bExpYkdyb3VwRGVzY3JpcHRvci50ZXN0KGxpbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIG5hbWUgb2YgbXRsIGZpbGVcclxuICAgICAgICAgICAgICAgIG9uRmlsZVRvTG9hZEZvdW5kKGxpbmUuc3Vic3RyaW5nKDcpLnRyaW0oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgc21vb3RoaW5nXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU29saWRQYXJzZXIuU21vb3RoRGVzY3JpcHRvci50ZXN0KGxpbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzbW9vdGggc2hhZGluZyA9PiBhcHBseSBzbW9vdGhpbmdcclxuICAgICAgICAgICAgICAgIC8vIFRvZGF5IEkgZG9uJ3Qga25vdyBpdCB3b3JrIHdpdGggYmFieWxvbiBhbmQgd2l0aCBvYmouXHJcbiAgICAgICAgICAgICAgICAvLyBXaXRoIHRoZSBvYmogZmlsZSAgYW4gaW50ZWdlciBpcyBzZXRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUgaXMgYW5vdGhlciBwb3NzaWJpbGl0eVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVbmhhbmRsZWQgZXhwcmVzc2lvbiBhdCBsaW5lIDogXCIgKyBsaW5lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQXQgdGhlIGVuZCBvZiB0aGUgZmlsZSwgYWRkIHRoZSBsYXN0IG1lc2ggaW50byB0aGUgbWVzaGVzRnJvbU9iaiBhcnJheVxyXG4gICAgICAgIGlmICh0aGlzLl9oYXNNZXNoZXMpIHtcclxuICAgICAgICAgICAgLy8gU2V0IHRoZSBkYXRhIGZvciB0aGUgbGFzdCBtZXNoXHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZWRNZXNoID0gdGhpcy5fbWVzaGVzRnJvbU9ialt0aGlzLl9tZXNoZXNGcm9tT2JqLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgLy9SZXZlcnNlIGluZGljZXMgZm9yIGRpc3BsYXlpbmcgZmFjZXMgaW4gdGhlIGdvb2Qgc2Vuc2VcclxuICAgICAgICAgICAgdGhpcy5faW5kaWNlc0ZvckJhYnlsb24ucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAvL0dldCB0aGUgZ29vZCBhcnJheVxyXG4gICAgICAgICAgICB0aGlzLl91bndyYXBEYXRhKCk7XHJcbiAgICAgICAgICAgIC8vU2V0IGFycmF5XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZWRNZXNoLmluZGljZXMgPSB0aGlzLl9pbmRpY2VzRm9yQmFieWxvbjtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2gucG9zaXRpb25zID0gdGhpcy5fdW53cmFwcGVkUG9zaXRpb25zRm9yQmFieWxvbjtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2gubm9ybWFscyA9IHRoaXMuX3Vud3JhcHBlZE5vcm1hbHNGb3JCYWJ5bG9uO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVkTWVzaC51dnMgPSB0aGlzLl91bndyYXBwZWRVVkZvckJhYnlsb247XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fbG9hZGluZ09wdGlvbnMuaW1wb3J0VmVydGV4Q29sb3JzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVkTWVzaC5jb2xvcnMgPSB0aGlzLl91bndyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBhbnkgbyBvciBnIGtleXdvcmQgbm90IGZvdW5kLCBjcmVhdGUgYSBtZXNoIHdpdGggYSByYW5kb20gaWRcclxuICAgICAgICBpZiAoIXRoaXMuX2hhc01lc2hlcykge1xyXG4gICAgICAgICAgICBsZXQgbmV3TWF0ZXJpYWw6IE51bGxhYmxlPFN0YW5kYXJkTWF0ZXJpYWw+ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2luZGljZXNGb3JCYWJ5bG9uLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmV2ZXJzZSB0YWIgb2YgaW5kaWNlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5kaWNlc0ZvckJhYnlsb24ucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgLy9HZXQgcG9zaXRpb25zIG5vcm1hbHMgdXZzXHJcbiAgICAgICAgICAgICAgICB0aGlzLl91bndyYXBEYXRhKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBpbmRpY2VzIGluIHRoZSBmaWxlLiBXZSB3aWxsIGhhdmUgdG8gc3dpdGNoIHRvIHBvaW50IGNsb3VkIHJlbmRlcmluZ1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwb3Mgb2YgdGhpcy5fcG9zaXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW53cmFwcGVkUG9zaXRpb25zRm9yQmFieWxvbi5wdXNoKHBvcy54LCBwb3MueSwgcG9zLnopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ub3JtYWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgbm9ybWFsIG9mIHRoaXMuX25vcm1hbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdW53cmFwcGVkTm9ybWFsc0ZvckJhYnlsb24ucHVzaChub3JtYWwueCwgbm9ybWFsLnksIG5vcm1hbC56KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3V2cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHV2IG9mIHRoaXMuX3V2cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91bndyYXBwZWRVVkZvckJhYnlsb24ucHVzaCh1di54LCB1di55KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbG9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNvbG9yIG9mIHRoaXMuX2NvbG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91bndyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uLnB1c2goY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbWF0ZXJpYWxOYW1lRnJvbU9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG1hdGVyaWFsIHdpdGggcG9pbnQgY2xvdWQgb25cclxuICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbCA9IG5ldyBTdGFuZGFyZE1hdGVyaWFsKEdlb21ldHJ5LlJhbmRvbUlkKCksIHNjZW5lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TWF0ZXJpYWwucG9pbnRzQ2xvdWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbE5hbWVGcm9tT2JqID0gbmV3TWF0ZXJpYWwubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9ub3JtYWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbC5kaXNhYmxlTGlnaHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNYXRlcmlhbC5lbWlzc2l2ZUNvbG9yID0gQ29sb3IzLldoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL1NldCBkYXRhIGZvciBvbmUgbWVzaFxyXG4gICAgICAgICAgICB0aGlzLl9tZXNoZXNGcm9tT2JqLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogR2VvbWV0cnkuUmFuZG9tSWQoKSxcclxuICAgICAgICAgICAgICAgIGluZGljZXM6IHRoaXMuX2luZGljZXNGb3JCYWJ5bG9uLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25zOiB0aGlzLl91bndyYXBwZWRQb3NpdGlvbnNGb3JCYWJ5bG9uLFxyXG4gICAgICAgICAgICAgICAgY29sb3JzOiB0aGlzLl91bndyYXBwZWRDb2xvcnNGb3JCYWJ5bG9uLFxyXG4gICAgICAgICAgICAgICAgbm9ybWFsczogdGhpcy5fdW53cmFwcGVkTm9ybWFsc0ZvckJhYnlsb24sXHJcbiAgICAgICAgICAgICAgICB1dnM6IHRoaXMuX3Vud3JhcHBlZFVWRm9yQmFieWxvbixcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsTmFtZTogdGhpcy5fbWF0ZXJpYWxOYW1lRnJvbU9iaixcclxuICAgICAgICAgICAgICAgIGRpcmVjdE1hdGVyaWFsOiBuZXdNYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgIGlzT2JqZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vU2V0IGRhdGEgZm9yIGVhY2ggbWVzaFxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fbWVzaGVzRnJvbU9iai5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAvL2NoZWNrIG1lc2hlc05hbWVzIChzdGxGaWxlTG9hZGVyKVxyXG4gICAgICAgICAgICBpZiAobWVzaGVzTmFtZXMgJiYgdGhpcy5fbWVzaGVzRnJvbU9ialtqXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWVzaGVzTmFtZXMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNoZXNOYW1lcy5pbmRleE9mKHRoaXMuX21lc2hlc0Zyb21PYmpbal0ubmFtZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX21lc2hlc0Zyb21PYmpbal0ubmFtZSAhPT0gbWVzaGVzTmFtZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0dldCB0aGUgY3VycmVudCBtZXNoXHJcbiAgICAgICAgICAgIC8vU2V0IHRoZSBkYXRhIHdpdGggVmVydGV4QnVmZmVyIGZvciBlYWNoIG1lc2hcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2ggPSB0aGlzLl9tZXNoZXNGcm9tT2JqW2pdO1xyXG4gICAgICAgICAgICAvL0NyZWF0ZSBhIE1lc2ggd2l0aCB0aGUgbmFtZSBvZiB0aGUgb2JqIG1lc2hcclxuXHJcbiAgICAgICAgICAgIHNjZW5lLl9ibG9ja0VudGl0eUNvbGxlY3Rpb24gPSAhIWFzc2V0Q29udGFpbmVyO1xyXG4gICAgICAgICAgICBjb25zdCBiYWJ5bG9uTWVzaCA9IG5ldyBNZXNoKHRoaXMuX21lc2hlc0Zyb21PYmpbal0ubmFtZSwgc2NlbmUpO1xyXG4gICAgICAgICAgICBiYWJ5bG9uTWVzaC5fcGFyZW50Q29udGFpbmVyID0gYXNzZXRDb250YWluZXI7XHJcbiAgICAgICAgICAgIHNjZW5lLl9ibG9ja0VudGl0eUNvbGxlY3Rpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlZE1lc2guX2JhYnlsb25NZXNoID0gYmFieWxvbk1lc2g7XHJcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBncm91cCBtZXNoLCBpdCBzaG91bGQgaGF2ZSBhbiBvYmplY3QgbWVzaCBhcyBhIHBhcmVudC4gU28gbG9vayBmb3IgdGhlIGZpcnN0IG9iamVjdCBtZXNoIHRoYXQgYXBwZWFycyBiZWZvcmUgaXQuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faGFuZGxlZE1lc2guaXNPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSBqIC0gMTsgayA+PSAwOyAtLWspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWVzaGVzRnJvbU9ialtrXS5pc09iamVjdCAmJiB0aGlzLl9tZXNoZXNGcm9tT2JqW2tdLl9iYWJ5bG9uTWVzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWJ5bG9uTWVzaC5wYXJlbnQgPSB0aGlzLl9tZXNoZXNGcm9tT2JqW2tdLl9iYWJ5bG9uTWVzaCE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9QdXNoIHRoZSBuYW1lIG9mIHRoZSBtYXRlcmlhbCB0byBhbiBhcnJheVxyXG4gICAgICAgICAgICAvL1RoaXMgaXMgaW5kaXNwZW5zYWJsZSBmb3IgdGhlIGltcG9ydE1lc2ggZnVuY3Rpb25cclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxUb1VzZS5wdXNoKHRoaXMuX21lc2hlc0Zyb21PYmpbal0ubWF0ZXJpYWxOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9oYW5kbGVkTWVzaC5wb3NpdGlvbnM/Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy9QdXNoIHRoZSBtZXNoIGludG8gYW4gYXJyYXlcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhYnlsb25NZXNoZXNBcnJheS5wdXNoKGJhYnlsb25NZXNoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhEYXRhOiBWZXJ0ZXhEYXRhID0gbmV3IFZlcnRleERhdGEoKTsgLy9UaGUgY29udGFpbmVyIGZvciB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAgIC8vU2V0IHRoZSBkYXRhIGZvciB0aGUgYmFieWxvbk1lc2hcclxuICAgICAgICAgICAgdmVydGV4RGF0YS51dnMgPSB0aGlzLl9oYW5kbGVkTWVzaC51dnMgYXMgRmxvYXRBcnJheTtcclxuICAgICAgICAgICAgdmVydGV4RGF0YS5pbmRpY2VzID0gdGhpcy5faGFuZGxlZE1lc2guaW5kaWNlcyBhcyBJbmRpY2VzQXJyYXk7XHJcbiAgICAgICAgICAgIHZlcnRleERhdGEucG9zaXRpb25zID0gdGhpcy5faGFuZGxlZE1lc2gucG9zaXRpb25zIGFzIEZsb2F0QXJyYXk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5jb21wdXRlTm9ybWFscykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsczogQXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XHJcbiAgICAgICAgICAgICAgICBWZXJ0ZXhEYXRhLkNvbXB1dGVOb3JtYWxzKHRoaXMuX2hhbmRsZWRNZXNoLnBvc2l0aW9ucywgdGhpcy5faGFuZGxlZE1lc2guaW5kaWNlcywgbm9ybWFscyk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhLm5vcm1hbHMgPSBub3JtYWxzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YS5ub3JtYWxzID0gdGhpcy5faGFuZGxlZE1lc2gubm9ybWFscyBhcyBGbG9hdEFycmF5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5pbXBvcnRWZXJ0ZXhDb2xvcnMpIHtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGEuY29sb3JzID0gdGhpcy5faGFuZGxlZE1lc2guY29sb3JzIGFzIEZsb2F0QXJyYXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9TZXQgdGhlIGRhdGEgZnJvbSB0aGUgVmVydGV4QnVmZmVyIHRvIHRoZSBjdXJyZW50IE1lc2hcclxuICAgICAgICAgICAgdmVydGV4RGF0YS5hcHBseVRvTWVzaChiYWJ5bG9uTWVzaCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkaW5nT3B0aW9ucy5pbnZlcnRZKSB7XHJcbiAgICAgICAgICAgICAgICBiYWJ5bG9uTWVzaC5zY2FsaW5nLnkgKj0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdPcHRpb25zLm9wdGltaXplTm9ybWFscykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3B0aW1pemVOb3JtYWxzKGJhYnlsb25NZXNoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9QdXNoIHRoZSBtZXNoIGludG8gYW4gYXJyYXlcclxuICAgICAgICAgICAgdGhpcy5fYmFieWxvbk1lc2hlc0FycmF5LnB1c2goYmFieWxvbk1lc2gpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2hhbmRsZWRNZXNoLmRpcmVjdE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICBiYWJ5bG9uTWVzaC5tYXRlcmlhbCA9IHRoaXMuX2hhbmRsZWRNZXNoLmRpcmVjdE1hdGVyaWFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1pbnRlcm5hbC1tb2R1bGVzICovXHJcbmltcG9ydCAqIGFzIExvYWRlcnMgZnJvbSBcImxvYWRlcnMvT0JKL2luZGV4XCI7XHJcblxyXG4vKipcclxuICogVGhpcyBpcyB0aGUgZW50cnkgcG9pbnQgZm9yIHRoZSBVTUQgbW9kdWxlLlxyXG4gKiBUaGUgZW50cnkgcG9pbnQgZm9yIGEgZnV0dXJlIEVTTSBwYWNrYWdlIHNob3VsZCBiZSBpbmRleC50c1xyXG4gKi9cclxuY29uc3QgZ2xvYmFsT2JqZWN0ID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XHJcbmlmICh0eXBlb2YgZ2xvYmFsT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBMb2FkZXJzKSB7XHJcbiAgICAgICAgaWYgKCEoPGFueT5nbG9iYWxPYmplY3QpLkJBQllMT05ba2V5XSkge1xyXG4gICAgICAgICAgICAoPGFueT5nbG9iYWxPYmplY3QpLkJBQllMT05ba2V5XSA9ICg8YW55PkxvYWRlcnMpW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgKiBmcm9tIFwibG9hZGVycy9PQkovaW5kZXhcIjtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2JhYnlsb25qc19NaXNjX29ic2VydmFibGVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBsb2FkZXJzIGZyb20gXCJAbHRzL2xvYWRlcnMvbGVnYWN5L2xlZ2FjeS1vYmpGaWxlTG9hZGVyXCI7XHJcbmV4cG9ydCB7IGxvYWRlcnMgfTtcclxuZXhwb3J0IGRlZmF1bHQgbG9hZGVycztcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9