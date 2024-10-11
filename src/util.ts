import Phaser from "phaser";
const XSCALE = 102
const YSCALE = 87

export function mapxy(x: number, y: number, z?: number): Phaser.Types.Math.Vector2Like;
export function mapxy(vec: Phaser.Types.Math.Vector3Like): Phaser.Types.Math.Vector2Like;
export function mapxy(xOrVec: number | Phaser.Types.Math.Vector3Like, yy?: number, zz?: number): Phaser.Types.Math.Vector2Like {
    let x: number, y: number, z: number
    if (typeof (xOrVec) !== "number") {
        x = xOrVec.x ?? 0.0
        y = xOrVec.y ?? 0.0
        z = xOrVec.z ?? 0.0
    } else {
        x = xOrVec
        y = yy ?? 0.0
        z = zz ?? 0.0
    }
    const xd = x * XSCALE
    const yd = y * YSCALE - z * 85.0
    return { x: xd, y: yd }
}
export function unmapxy(x: number, y: number): Phaser.Types.Math.Vector3Like;
export function unmapxy(vec: Phaser.Types.Math.Vector2Like): Phaser.Types.Math.Vector3Like;
export function unmapxy(xOrVec: number | Phaser.Types.Math.Vector2Like, yy?: number): Phaser.Types.Math.Vector3Like {
    let x: number, y: number
    if (typeof (xOrVec) !== "number") {
        x = xOrVec.x
        y = xOrVec.y

    } else {
        x = xOrVec
        y = yy ?? 0.0

    }
    const xd = x / XSCALE
    const yd = y / YSCALE
    return { x: xd, y: yd }
}

// You can only move one step at a time, not diagonal
export function valid_move(oldx: number, oldy: number, newx: number, newy: number): boolean {
    if (newx < 0 || newx >= 30 || newy < 0 || newy >= 15) { return false }
    if (oldx === newx) {
        return newy === (oldy + 1) || newy === (oldy - 1)
    } else if (oldy === newy) {
        return newx === (oldx + 1) || newx === (oldx - 1)
    } else return false
}