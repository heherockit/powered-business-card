// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:powered_business_card_mobile/main.dart';

void main() {
  testWidgets('renders HomePage with title and input', (WidgetTester tester) async {
    await tester.pumpWidget(const PoweredBusinessCardApp());

    // AppBar title should be present
    expect(find.text('Powered Business Card'), findsOneWidget);

    // TextField should exist on the page
    expect(find.byType(TextField), findsOneWidget);
  });
}
