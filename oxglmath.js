// OX WebGL Mathライブラリ
//
//  WebGL用の数学関数ライブラリ
//


var OXMath = function() {};

// 3次元ベクトル
OXMath.Vec3 = function(x, y, z) {
	var me = this;
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
	
	// 足し算
	this.add = function( v ) {
		return new OXMath.Vec3( me.x + v.x, me.y + v.y, me.z + v.z );
	}
	
	// 引き算
	this.sub = function( v ) {
		return new OXMath.Vec3( me.x - v.x, me.y - v.y, me.z - v.z );
	}
	
	// 長さ
	this.len = function() {
		return Math.sqrt( x * x + y * y + z * z );
	}

	// 正規化
	this.normal = function() {
		var n = me.len();
		if ( n != 0.0 )
			return new OXMath.Vec3( x / n, y / n, z / n );
		return new OXMath.Vec3();
	}

	// 外積
	this.cross = function( r ) {
		return new OXMath.Vec3(
			 y * r.z - z * r.y,
			 z * r.x - x * r.z,
			 x * r.y - y * r.x
		);
	}

	// 内積
	this.dot = function( r ) {
		return x * r.x + y * r.y + z * r.z;
	}
}

// 4x4行列
OXMath.Mat4x4 = function() {
	var me = this;
	this.m11 = 1.0; this.m12 = 0.0; this.m13 = 0.0; this.m14 = 0.0;
	this.m21 = 0.0; this.m22 = 1.0; this.m23 = 0.0; this.m24 = 0.0;
	this.m31 = 0.0; this.m32 = 0.0; this.m33 = 1.0; this.m34 = 0.0;
	this.m41 = 0.0; this.m42 = 0.0; this.m43 = 0.0; this.m44 = 1.0;
	
	this.ary = function() {
		return [ 
			me.m11, me.m12, me.m13, me.m14,
			me.m21, me.m22, me.m23, me.m24,
			me.m31, me.m32, me.m33, me.m34,
			me.m41, me.m42, me.m43, me.m44
		];
	}

	this.aryT = function() {
		return [ 
			me.m11, me.m21, me.m31, me.m41,
			me.m12, me.m22, me.m32, me.m42,
			me.m13, me.m23, me.m33, me.m43,
			me.m14, me.m24, me.m34, me.m44
		];
	}
	
	this.mul = function( m1 ) {
		var r = new OXMath.Mat4x4();
		r.m11 = me.m11 * m1.m11 + me.m12 * m1.m21 + me.m13 * m1.m31 + me.m14 * m1.m41;
		r.m12 = me.m11 * m1.m12 + me.m12 * m1.m22 + me.m13 * m1.m32 + me.m14 * m1.m42;
		r.m13 = me.m11 * m1.m13 + me.m12 * m1.m23 + me.m13 * m1.m33 + me.m14 * m1.m43;
		r.m14 = me.m11 * m1.m14 + me.m12 * m1.m24 + me.m13 * m1.m34 + me.m14 * m1.m44;

		r.m21 = me.m21 * m1.m11 + me.m22 * m1.m21 + me.m23 * m1.m31 + me.m24 * m1.m41;
		r.m22 = me.m21 * m1.m12 + me.m22 * m1.m22 + me.m23 * m1.m32 + me.m24 * m1.m42;
		r.m23 = me.m21 * m1.m13 + me.m22 * m1.m23 + me.m23 * m1.m33 + me.m24 * m1.m43;
		r.m24 = me.m21 * m1.m14 + me.m22 * m1.m24 + me.m23 * m1.m34 + me.m24 * m1.m44;

		r.m31 = me.m31 * m1.m11 + me.m32 * m1.m21 + me.m33 * m1.m31 + me.m34 * m1.m41;
		r.m32 = me.m31 * m1.m12 + me.m32 * m1.m22 + me.m33 * m1.m32 + me.m34 * m1.m42;
		r.m33 = me.m31 * m1.m13 + me.m32 * m1.m23 + me.m33 * m1.m33 + me.m34 * m1.m43;
		r.m34 = me.m31 * m1.m14 + me.m32 * m1.m24 + me.m33 * m1.m34 + me.m34 * m1.m44;

		r.m41 = me.m41 * m1.m11 + me.m42 * m1.m21 + me.m43 * m1.m31 + me.m44 * m1.m41;
		r.m42 = me.m41 * m1.m12 + me.m42 * m1.m22 + me.m43 * m1.m32 + me.m44 * m1.m42;
		r.m43 = me.m41 * m1.m13 + me.m42 * m1.m23 + me.m43 * m1.m33 + me.m44 * m1.m43;
		r.m44 = me.m41 * m1.m14 + me.m42 * m1.m24 + me.m43 * m1.m34 + me.m44 * m1.m44;
		
		return r;
	}
}

// Degree -> Radian
OXMath.toRad = function( deg ) {
	return deg / 180.0 * 3.14159265358979;
}

// LookAtでビュー行列作成
OXMath.lookAtLH = function( eye, at, up ) {
	var zaxis = at.sub( eye ).normal();
	var xaxis = up.cross( zaxis ).normal();
	var yaxis = zaxis.cross( xaxis );
	
	var m = new OXMath.Mat4x4();
	m.m11 = xaxis.x; m.m12 = yaxis.x; m.m13 = zaxis.x;
	m.m21 = xaxis.y; m.m22 = yaxis.y; m.m23 = zaxis.y;
	m.m31 = xaxis.z; m.m32 = yaxis.z; m.m33 = zaxis.z;
	m.m41 = -xaxis.dot( eye );
	m.m42 = -yaxis.dot( eye );
	m.m43 = -zaxis.dot( eye );
	
	return m;
}

// パースペクティブ行列作成
OXMath.perspLH = function( fovY, aspect, zn, zf ) {
	var yScale = 1.0 / Math.tan(fovY/2)
	var xScale = yScale / aspect;

	var m = new OXMath.Mat4x4();
	m.m11 = xScale;
	m.m22 = yScale;
	m.m33 = zf / ( zf - zn );
	m.m34 = 1.0;
	m.m43 = -zn * zf / ( zf - zn );
	m.m44 = 0.0;

	return m;
}