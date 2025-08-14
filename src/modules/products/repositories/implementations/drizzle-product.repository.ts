import { ProductEntity } from '../../entities/product.entity';
import { ProductRepository } from '../product.repository';
import { db } from 'src/database/drizzle';
import { eq } from 'drizzle-orm';
import { products } from 'src/database/schemas/products';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleProductRepository implements ProductRepository {
  async create(data: {
    name: string;
    description: string;
    price: number;
  }): Promise<ProductEntity> {
    try {
      const [row] = await db
        .insert(products)
        .values({
          name: data.name,
          description: data.description,
          price: data.price,
        })
        .returning();

      return new ProductEntity(row);
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.code === '23505') {
        throw new ConflictException('Product name already exists');
      }
      throw err;
    }
  }
  async findByName(name: string): Promise<ProductEntity | null> {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .limit(1);

    const row = rows[0];
    return row ? new ProductEntity(row) : null;
  }
}
