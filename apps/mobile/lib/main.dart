import 'package:flutter/material.dart';
import 'features/home/presentation/home_page.dart';

void main() {
  runApp(const PoweredBusinessCardApp());
}

class PoweredBusinessCardApp extends StatelessWidget {
  const PoweredBusinessCardApp({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = const ColorScheme.dark(
      primary: Color(0xFF6366F1),
      surface: Color(0xFF0F172A),
      onSurface: Color(0xFFE2E8F0),
    );

    return MaterialApp(
      title: 'Powered Business Card',
      theme: ThemeData(
        colorScheme: colorScheme,
        useMaterial3: true,
        textTheme: const TextTheme(
          bodyMedium: TextStyle(fontSize: 16.0),
          titleLarge: TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
      home: const HomePage(),
    );
  }
}