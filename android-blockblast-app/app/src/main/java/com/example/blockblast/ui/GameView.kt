package com.example.blockblast.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import kotlin.math.floor

class GameView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null
) : View(context, attrs) {

    var onScoreChanged: ((Int) -> Unit)? = null
    var onGameOver: (() -> Unit)? = null

    private val gridCols = 10
    private val gridRows = 10
    private val grid = Array(gridRows) { IntArray(gridCols) { 0 } }

    private val paintGrid = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.DKGRAY }
    private val paintTile = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(90, 160, 255) }
    private val paintBg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.BLACK }

    private var score = 0

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paintBg)
        val cellSize = width / gridCols.toFloat()
        // draw grid lines
        for (r in 0..gridRows) {
            canvas.drawLine(0f, r * cellSize, width.toFloat(), r * cellSize, paintGrid)
        }
        for (c in 0..gridCols) {
            canvas.drawLine(c * cellSize, 0f, c * cellSize, height.toFloat(), paintGrid)
        }
        // draw tiles
        for (r in 0 until gridRows) {
            for (c in 0 until gridCols) {
                if (grid[r][c] != 0) {
                    val left = c * cellSize
                    val top = r * cellSize
                    canvas.drawRect(left + 2f, top + 2f, left + cellSize - 2f, top + cellSize - 2f, paintTile)
                }
            }
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (event.action != MotionEvent.ACTION_DOWN) return true
        val cellSize = width / gridCols.toFloat()
        val c = floor(event.x / cellSize).toInt().coerceIn(0, gridCols - 1)
        val r = floor(event.y / cellSize).toInt().coerceIn(0, gridRows - 1)
        if (grid[r][c] == 0) {
            grid[r][c] = 1
            score += clearCompleted()
            onScoreChanged?.invoke(score)
            invalidate()
        } else {
            // Simple game over condition when tapping an occupied cell
            onGameOver?.invoke()
        }
        return true
    }

    private fun clearCompleted(): Int {
        var gained = 0
        // clear full rows
        for (r in 0 until gridRows) {
            if (grid[r].all { it != 0 }) {
                for (c in 0 until gridCols) grid[r][c] = 0
                gained += 10
            }
        }
        // clear full columns
        for (c in 0 until gridCols) {
            var full = true
            for (r in 0 until gridRows) if (grid[r][c] == 0) { full = false; break }
            if (full) {
                for (r in 0 until gridRows) grid[r][c] = 0
                gained += 10
            }
        }
        return gained
    }
}
