/**
 * シェーダー定義用のファイルです
 * @author Nozomi Nohara / http://github.com/ics-nohara
 */
module shader{

	export interface IShaderUniforms {
		type:string;
		value:any;
	}

	export interface IShader{
		vertexShader: string;
		uniforms: { [key:string]:IShaderUniforms };
		fragmentShader: string;
	}
}
